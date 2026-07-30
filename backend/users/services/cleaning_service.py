import pandas as pd
import numpy as np
import json
import re

# # def clean_dataset(data):
# #     """
# #     Cleans a list of dictionaries containing either student or instructor survey data.
# #     Returns a cleaned list of dictionaries.
# #     """

# #     # Convert list of dicts to DataFrame
# #     df = pd.DataFrame(data)

# #     # Detect survey type
# #     if 'Total Engage Score-P' in df.columns or 'Content-P_1' in df.columns:
# #         survey_type = 'instructor'
# #     else:
# #         survey_type = 'student'

# #     if survey_type == 'student':
# #         # --- Student Cleaning Logic ---
# #         df = df.iloc[1:].copy()  # Remove first row if duplicate header
# #         df.replace(
# #             ["nan", "Nan", "NAN", "Unknown", "N/A", "N\A", ""],
# #             np.nan,
# #             inplace=True
# #         )
# #         df = df.drop_duplicates()
# #         df = df.dropna(how='all')

# #         # Standardize column names
# #         df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# #         # Clean object columns
# #         for col in df.select_dtypes(include='object').columns:
# #             df[col] = df[col].astype(str).str.strip()
# #             df[col] = df[col].replace({
# #                 'Yes':'Yes','YES':'Yes','yes':'Yes','Y':'Yes',
# #                 'No':'No','NO':'No','no':'No','N':'No'
# #             })

# #         df["q3"] = df["q3"].where(df["q3"] != "Other", df["q3_4_text"])

# #         # Remove old columns permanently
# #         df.drop(["q3_4_text"], axis=1, inplace=True)    
# #         uni_map = {
# #         "Emu": "Eastern Michigan University",
# #         "Dha Suffa University": "DHA Suffa University",
# #         "Dha Suffa University karachi": "DHA Suffa University"
# #         }
# #         df['q2'] = df['q2'].astype(str).str.strip()
# #         df['q2'] = df['q2'].replace(uni_map)
# #         df['q2'] = df['q2'].str.title()

# #         df['q4'] = df['q4'].astype(str).str.strip().str.lower()

# #         df.loc[
# #             df['q4'].str.contains("deep", na=False) &
# #             df['q4'].str.contains("learn", na=False),
# #             'q4'
# #         ] = "Deep Learning"

# #         df.loc[df['q4'].str.contains("492", na=False), 'q4'] = "Deep Learning"

# #         df['q4'] = df['q4'].str.title()

# #         df["q6"] = df["q6"].str.extract(r"(Class instructor|Student)")

# #         # Remove extra spaces
# #         df["q6"] = df["q6"].str.strip()


# #         # Convert numeric columns
# #         for col in ['age', 'rating', 'score']:
# #             if col in df.columns:
# #                 df[col] = pd.to_numeric(df[col], errors='coerce')

# #         # Convert date columns
# #         if 'start_date' in df.columns:
# #             df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
# #             # df['startdate'] = pd.to_datetime(df['startdate'], errors='coerce', infer_datetime_format=True)
# #             df = df[df['start_date'].notna()]

# #         # Email validation
# #         if 'email' in df.columns:
# #             email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
# #             df = df[df['email'].str.match(email_pattern, na=False)]
# #             df = df.reset_index(drop=True)

# #         # Age validation
# #         if 'age' in df.columns:
# #             df.loc[(df['age'] < 10) | (df['age'] > 100), 'age'] = pd.NA

# #         # Fill missing values
# #         for col in df.columns:
# #             if df[col].dtype == 'object':
# #                 df[col] = df[col].fillna("Unknown")
# #             elif pd.api.types.is_numeric_dtype(df[col]):
# #                 median_value = df[col].median()
# #                 if pd.notna(median_value):
# #                     df[col] = df[col].fillna(median_value)

# #     else:
# #         # --- Instructor Cleaning Logic ---
# #         df.columns = (df.columns
# #                       .str.strip()
# #                       .str.lower()
# #                       .str.replace(" ", "_")
# #                       .str.replace("-", "_")
# #                       .str.replace(".", "_", regex=False)
# #                       .str.replace("__", "_", regex=False))

# #         df = df.iloc[1:].copy()
# #         df = df.dropna(how='all')
# #         df = df[df.isnull().mean(axis=1) < 0.8]

# #         for col in df.select_dtypes(include='object').columns:
# #             df[col] = df[col].astype(str).str.strip()

# #         # Keep completed surveys only
# #         df['total_engage_score_p'] = pd.to_numeric(df['total_engage_score_p'], errors='coerce')

# #         df.loc[(df['total_engage_score_p'] < 0) | (df['total_engage_score_p'] > 100), 'total_engage_score_p'] = pd.NA

# #         df['startdate'] = pd.to_datetime(df['startdate'], errors='coerce')
# #         df = df[df['startdate'].notna()]

# #         df = df.drop_duplicates()
# #         df = df.reset_index(drop=True)

# #         # Email validation
# #         email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
# #         df['q108'] = df['q108'].astype(str).str.strip().str.lower()
# #         df.loc[~df['q108'].str.match(email_pattern, na=False), 'q108'] = pd.NA

# #         # University mapping
# #         uni_map = {"Emu": "Eastern Michigan University", "Dha Suffa University": "DHA Suffa University"}
# #         df['q2'] = df['q2'].astype(str).str.strip()
# #         df['q2'] = df['q2'].replace(uni_map)
# #         df['q2'] = df['q2'].str.title()

# #         # Likert scale mapping
# #         likert_cols = [col for col in df.columns if col.startswith((
# #             'relevance', 'discuss', 'act_part',
# #             'cls_org', 'challenge_level', 'cncts'))]

# #         likert_map = {
# #             "Never": 1, "Rarely": 2, "Sometimes": 3, "About half the time": 3,
# #             "Most of the time": 4, "Almost always": 5, "Always": 5
# #         }

# #         for col in likert_cols:
# #             df[col] = df[col].map(likert_map).astype("float")
    

# #         for col in likert_cols:
# #            df.loc[(df[col] < 1) | (df[col] > 5), col] = pd.NA

# #         df['response_variation'] = df[likert_cols].std(axis=1)
# #         df = df[df['response_variation'] >= 0.2]
# #         df = df.drop(columns=['response_variation'])

# #     # Convert cleaned DataFrame back to list of dicts
# #     cleaned_data = df.to_dict(orient='records')
# #     print(cleaned_data)
# #     return cleaned_data

# def clean_dataset(data):
#     df = pd.DataFrame(data)
#     print("Initial DataFrame:")
#     print(type(data))
#     print(data[:2])
#     print("-----------------------")
#     # Detect survey type
#     if 'Total Engage Score-P' in df.columns or 'Content-P_1' in df.columns:
#         survey_type = 'instructor'
#     else:
#         survey_type = 'student'

#     if survey_type == 'student':
#         df = df.iloc[1:].copy()

#         df.replace(["nan", "Nan", "NAN", "Unknown", "N/A", "N\\A", ""],
#                    np.nan, inplace=True)

#         df = df.drop_duplicates()
#         df = df.dropna(how='all')

#         df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

#         for col in df.select_dtypes(include='object').columns:
#             df[col] = df[col].astype(str).str.strip()
#             df[col] = df[col].replace({
#                 'Yes':'Yes','YES':'Yes','yes':'Yes','Y':'Yes',
#                 'No':'No','NO':'No','no':'No','N':'No'
#             })

#         if "q3_4_text" in df.columns:
#             df["q3"] = df["q3"].where(df["q3"] != "Other", df["q3_4_text"])
#             df.drop(["q3_4_text"], axis=1, inplace=True)

#         if "q2" in df.columns:
#             uni_map = {
#                 "Emu": "Eastern Michigan University",
#                 "Dha Suffa University": "DHA Suffa University",
#                 "Dha Suffa University karachi": "DHA Suffa University"
#             }
#             df['q2'] = df['q2'].astype(str).str.strip()
#             df['q2'] = df['q2'].replace(uni_map).str.title()

#         if "q4" in df.columns:
#             df['q4'] = df['q4'].astype(str).str.strip().str.lower()
#             df.loc[df['q4'].str.contains("deep", na=False) &df['q4'].str.contains("learn", na=False),'q4'] = "Deep Learning"
#             df['q4'] = df['q4'].str.title()

#         if "q6" in df.columns:
#             df["q6"] = df["q6"].str.extract(r"(Class instructor|Student)")
#             df["q6"] = df["q6"].str.strip()

#         for col in ['age', 'rating', 'score']:
#             if col in df.columns:
#                 df[col] = pd.to_numeric(df[col], errors='coerce')

#         if 'start_date' in df.columns:
#             df['start_date'] = pd.to_datetime(df['start_date'], errors='coerce')
#             df = df[df['start_date'].notna()]

#         if 'email' in df.columns:
#             email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
#             df = df[df['email'].str.match(email_pattern, na=False)]
#             df = df.reset_index(drop=True)

#         if 'age' in df.columns:
#             df.loc[(df['age'] < 10) | (df['age'] > 100), 'age'] = pd.NA

#         for col in df.columns:
#             if df[col].dtype == 'object':
#                 df[col] = df[col].fillna("Unknown")
#             elif pd.api.types.is_numeric_dtype(df[col]):
#                 median = df[col].median()
#                 if pd.notna(median):
#                     df[col] = df[col].fillna(median)
#         df = df.astype(str)
#     else:
#         df.columns = (df.columns.str.strip().str.lower()
#                       .str.replace(" ", "_")
#                       .str.replace("-", "_")
#                       .str.replace(".", "_", regex=False)
#                       )

#         df = df.iloc[1:].copy()
#         df = df.dropna(how='all')

#         df = df[df.isnull().mean(axis=1) < 0.8]

#         for col in df.select_dtypes(include='object').columns:
#             df[col] = df[col].astype(str).str.strip()

#         df['total_engage_score_p'] = pd.to_numeric(df['total_engage_score_p'], errors='coerce')

#         df.loc[(df['total_engage_score_p'] < 0) | 
#        (df['total_engage_score_p'] > 100),
#        'total_engage_score_p'] = pd.NA
    
#     # Convert start date
#         df['startdate'] = pd.to_datetime(df['startdate'], errors='coerce')
#         df = df[df['startdate'].notna()]

#     # Remove duplicates
#         df = df.drop_duplicates()
#         df = df.reset_index(drop=True)

#         email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
#         df['q108'] = df['q108'].astype(str).str.strip().str.lower()
#         df.loc[~df['q108'].str.match(email_pattern, na=False), 'q108'] = pd.NA



#         uni_map = {
#     "Emu": "Eastern Michigan University",
#     "Dha Suffa University": "DHA Suffa University"
#      }
#         df['q2'] = df['q2'].astype(str).str.strip()
#         df['q2'] = df['q2'].replace(uni_map)
#         df['q2'] = df['q2'].str.title()
    
# # Identify Likert columns
#         likert_cols = [col for col in df.columns
#                if col.startswith((
                   
#                    'relevance',
#                    'discuss',
#                    'act_part',
                   
#                    'cls_org',
#                    'challenge_level',
#                    'cncts'
#                ))]

# # Define mapping
#         likert_map = {
#     "Never": 1,
#     "Rarely": 2,
#     "Sometimes": 3,
#     "About half the time": 3,
#     "Most of the time": 4,
#     "Almost always": 5,
#     "Always": 5
# }

# # Apply mapping
#         for col in likert_cols:
#             df[col] = df[col].map(likert_map).astype("float")
    

#         for col in likert_cols:
#            df.loc[(df[col] < 1) | (df[col] > 5), col] = pd.NA

#         df['response_variation'] = df[likert_cols].std(axis=1)
#         df = df[df['response_variation'] >= 0.2]
#         df = df.drop(columns=['response_variation'])
 
#         df = df.astype(str)
#         print("Cleaned DataFrame:")
#         print(df.head())
#         print("-----------------------")
#     return json.loads(df.to_json(orient='records', date_format='iso'))


import pandas as pd
import numpy as np
import json
import re


def clean_dataset(data):
    """
    Comprehensive cleaning service for Student and Instructor survey datasets.
    - Standardizes column headers & survey feature names
    - Normalizes University names, Course titles, Yes/No values, and Role fields
    - Merges q3 specialization with q3_4_text
    - Maps Likert scale responses (1-5 numeric scale)
    - Validates age, scores, and email formats non-destructively
    - Fills missing values (median for numeric, 'Unknown' for categorical)
    """
    if not data:
        return []

    try:
        df_original = pd.DataFrame(data)
        if df_original.empty:
            return []

        df = df_original.copy()

        # 1. Standardize column names
        df.columns = [
            str(col).strip().lower()
            .replace(" ", "_")
            .replace("-", "_")
            .replace(".", "_")
            .replace("__", "_")
            for col in df.columns
        ]

        # 2. Trim whitespace & standardize Yes/No values
        yes_no_map = {
            'yes': 'Yes', 'YES': 'Yes', 'y': 'Yes',
            'no': 'No', 'NO': 'No', 'n': 'No'
        }
        for col in df.select_dtypes(include='object').columns:
            df[col] = df[col].astype(str).str.strip()
            mapped_yn = df[col].str.lower().map(yes_no_map)
            df.loc[mapped_yn.notna(), col] = mapped_yn.dropna()

        # 3. Merge q3 specialization with q3_4_text if present
        if 'q3' in df.columns and 'q3_4_text' in df.columns:
            df['q3'] = df['q3'].where(df['q3'] != 'Other', df['q3_4_text'])
            df.drop(columns=['q3_4_text'], inplace=True, errors='ignore')

        # 4. University Name Normalization (q2 / university)
        uni_cols = [c for c in ['q2', 'university', 'q2_university'] if c in df.columns]
        uni_map = {
            'emu': 'Eastern Michigan University',
            'dha suffa university': 'DHA Suffa University',
            'dha suffa university karachi': 'DHA Suffa University'
        }
        for col in uni_cols:
            df[col] = df[col].astype(str).str.strip()
            lower_uni = df[col].str.lower()
            for key, val in uni_map.items():
                df.loc[lower_uni == key, col] = val
            df[col] = df[col].str.title()

        # 5. Course Title Normalization (q4 / course)
        course_cols = [c for c in ['q4', 'course', 'q4_course'] if c in df.columns]
        for col in course_cols:
            s = df[col].astype(str).str.strip().str.lower()
            mask_dl = (s.str.contains('deep', na=False) & s.str.contains('learn', na=False)) | s.str.contains('492', na=False)
            df.loc[mask_dl, col] = 'Deep Learning'
            df[col] = df[col].str.title()

        # 6. Role Extraction (q6 / role)
        role_cols = [c for c in ['q6', 'role', 'q6_role'] if c in df.columns]
        for col in role_cols:
            extracted = df[col].astype(str).str.extract(r'(Class instructor|Student|Teacher|Instructor)', flags=re.IGNORECASE, expand=False)
            df.loc[extracted.notna(), col] = extracted.dropna().str.strip().str.title()

        # 7. Likert Scale Mapping (1-5 scale)
        likert_map = {
            'never': 1, 'rarely': 2, 'sometimes': 3,
            'about half the time': 3, 'most of the time': 4,
            'almost always': 5, 'always': 5,
            'strongly disagree': 1, 'disagree': 2, 'neutral': 3,
            'agree': 4, 'strongly agree': 5
        }

        for col in df.columns:
            if col.startswith(('content_', 'relevance_', 'discuss_', 'act_part_', 'cls_org_', 'cncts_', 'challenge_level_')) or 'likert' in col:
                mapped = df[col].astype(str).str.strip().str.lower().map(likert_map)
                if mapped.notna().sum() > 0:
                    df[col] = mapped

        # 8. Range & Bounds Validations
        if 'age' in df.columns:
            df['age'] = pd.to_numeric(df['age'], errors='coerce')
            df.loc[(df['age'] < 10) | (df['age'] > 100), 'age'] = np.nan

        score_cols = [c for c in ['total_engage_score_p', 'total_engage_score_s', 'rating', 'score'] if c in df.columns]
        for col in score_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df.loc[(df[col] < 0) | (df[col] > 100), col] = np.nan

        # 9. Email Format Validation
        email_cols = [c for c in ['email', 'q108', 'q108_email'] if c in df.columns]
        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        for col in email_cols:
            invalid_mask = ~df[col].astype(str).str.strip().str.lower().str.match(email_pattern, na=False)
            df.loc[invalid_mask & df[col].notna(), col] = np.nan

        # 10. Date Parsing
        date_cols = [c for c in ['start_date', 'startdate', 'created_at'] if c in df.columns]
        for col in date_cols:
            df[col] = pd.to_datetime(df[col], errors='coerce')

        # 11. Non-destructive Imputation
        for col in df.columns:
            numeric_series = pd.to_numeric(df[col], errors='coerce')
            if numeric_series.notna().sum() > (len(df) * 0.4):
                df[col] = numeric_series
                median_val = df[col].median()
                if pd.notna(median_val):
                    df[col] = df[col].fillna(median_val)
            else:
                df[col] = df[col].replace(["nan", "Nan", "NAN", "Unknown", "N/A", "N\\A", "", "None", None], np.nan)
                df[col] = df[col].fillna('Unknown')

        # Drop rows ONLY if completely empty
        df = df.dropna(how='all')

        if df.empty:
            df = df_original

        return json.loads(df.to_json(orient='records', date_format='iso'))

    except Exception as e:
        print(f"Data cleaning fallback triggered: {e}")
        return data