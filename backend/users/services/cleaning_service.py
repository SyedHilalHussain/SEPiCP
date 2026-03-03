import logging
import pandas as pd
import re

logger = logging.getLogger(__name__)

def clean_dataset(data):
    """
    Cleans a list of dictionaries containing either student or instructor survey data.
    Returns a cleaned list of dictionaries.
    """
    if not data:
        raise ValueError("The provided dataset is empty.")

    try:
        # Convert list of dicts to DataFrame
        df = pd.DataFrame(data)
        
        if df.empty:
            raise ValueError("The uploaded dataset contains no rows or columns.")

        # Detect survey type
        if 'Total Engage Score-P' in df.columns or 'Content-P_1' in df.columns:
            survey_type = 'instructor'
        else:
            survey_type = 'student'

        if survey_type == 'student':
            # --- Student Cleaning Logic ---
            df = df.iloc[1:].copy()  # Remove first row if duplicate header
            df = df.drop_duplicates()
            df = df.dropna(how='all')

            # Standardize column names
            df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

            # Clean object columns
            for col in df.select_dtypes(include='object').columns:
                df[col] = df[col].astype(str).str.strip()
                df[col] = df[col].replace({
                    'Yes':'Yes','YES':'Yes','yes':'Yes','Y':'Yes',
                    'No':'No','NO':'No','no':'No','N':'No'
                })

            # Convert numeric columns
            for col in ['age', 'rating', 'score']:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce')

            # Convert date columns
            if 'start_date' in df.columns:
                df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
                df = df[df['start_date'].notna()]

            # Email validation
            if 'email' in df.columns:
                email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
                df = df[df['email'].str.match(email_pattern, na=False)]
                df = df.reset_index(drop=True)

            # Age validation
            if 'age' in df.columns:
                df.loc[(df['age'] < 10) | (df['age'] > 100), 'age'] = pd.NA

            # Fill missing values
            for col in df.columns:
                if df[col].dtype == 'object':
                    df[col] = df[col].fillna("Unknown")
                elif pd.api.types.is_numeric_dtype(df[col]):
                    median_value = df[col].median()
                    if pd.notna(median_value):
                        df[col] = df[col].fillna(median_value)

        else:
            # --- Instructor Cleaning Logic ---
            df.columns = (df.columns
                          .str.strip()
                          .str.lower()
                          .str.replace(" ", "_")
                          .str.replace("-", "_")
                          .str.replace(".", "_", regex=False)
                          .str.replace("__", "_", regex=False))

            df = df.iloc[1:].copy()
            df = df.dropna(how='all')
            df = df[df.isnull().mean(axis=1) < 0.8]

            for col in df.select_dtypes(include='object').columns:
                df[col] = df[col].astype(str).str.strip()

            # Keep completed surveys only
            df['progress'] = pd.to_numeric(df['progress'], errors='coerce')
            df = df[df['progress'] == 100]

            df['total_engage_score_p'] = pd.to_numeric(df['total_engage_score_p'], errors='coerce')
            df.loc[(df['total_engage_score_p'] < 0) | (df['total_engage_score_p'] > 100), 'total_engage_score_p'] = pd.NA

            df['startdate'] = pd.to_datetime(df['startdate'], errors='coerce')
            df = df[df['startdate'].notna()]

            df = df.drop_duplicates()
            df = df.reset_index(drop=True)

            # Email validation
            email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
            df['q108'] = df['q108'].astype(str).str.strip().str.lower()
            df.loc[~df['q108'].str.match(email_pattern, na=False), 'q108'] = pd.NA

            # University mapping
            uni_map = {"Emu": "Eastern Michigan University", "Dha Suffa University": "DHA Suffa University"}
            df['q2'] = df['q2'].astype(str).str.strip().replace(uni_map).str.title()

            # Likert scale mapping
            likert_cols = [col for col in df.columns if col.startswith((
                'content_p', 'relevance', 'discuss', 'act_part', 'methods_p',
                'cls_org', 'challenge_level', 'cncts'))]

            likert_map = {
                "Never": 1, "Rarely": 2, "Sometimes": 3, "About half the time": 3,
                "Most of the time": 4, "Almost always": 5, "Always": 5
            }

            for col in likert_cols:
                df[col] = df[col].map(likert_map).astype("float")
                df.loc[(df[col] < 1) | (df[col] > 5), col] = pd.NA

            # Remove low variation responses
            df['response_variation'] = df[likert_cols].std(axis=1)
            df = df[df['response_variation'] >= 0.2]
            df = df.drop(columns=['response_variation'])

        import json
        cleaned_data = json.loads(df.to_json(orient='records', date_format='iso'))
        
        if not cleaned_data:
            raise ValueError("All data was filtered out during the cleaning process. Please ensure the data matches the expected format.")
            
        return cleaned_data

    except ValueError as ve:
        # Re-raise intended value errors (like empty dataset)
        raise ve
    except Exception as e:
        logger.error(f"Error during dataset cleaning: {str(e)}", exc_info=True)
        raise ValueError(f"An unexpected error occurred while cleaning the dataset: {str(e)}")