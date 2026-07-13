# from django.shortcuts import render
# from rest_framework.decorators import api_view
# pyrefly: ignore [missing-import]
from rest_framework import generics, permissions
# pyrefly: ignore [missing-import]
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Dataset, InstructorSurvey, StudentSurvey
from .serializers import RegisterSerializer, UserSerializer, DatasetSerializer, InstructorSurveySerializer, StudentSurveySerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .services.cleaning_service import clean_dataset
from .services.analysis.regression_service import perform_regression_analysis
from .services.analysis.pca_service import perform_pca_analysis
from .services.analysis.basic_analysis_service import perform_basic_analysis
from .models import AnalysisResult

User = get_user_model()


#CreateAPIView internally does 
# serializer = RegisterSerializer(data=request.data)
# if serializer.is_valid():
#     serializer.save()
# else:
#     return serializer.errors

# 1️⃣ Register View
# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer
class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "success": True,
                "message": "User registered successfully",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


# 2️⃣ Get Logged-in User Profile
class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# 3️⃣ Admin - View All Users
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


# 4️⃣ Admin Dashboard Stats (Optional but Professional)
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        admin_users = User.objects.filter(is_staff=True).count()

        return Response({
            "total_users": total_users,
            "admin_users": admin_users,
        })

import pandas as pd
import json

class UploadDatasetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        file = request.FILES.get("file")
        json_data = request.data.get("data")
        
        # DEBUG LOGGING
        with open("upload_debug.txt", "w") as f:
            f.write(f"file: {file}\n")
            f.write(f"request.data type: {type(request.data)}\n")
            f.write(f"request.data keys: {request.data.keys() if hasattr(request.data, 'keys') else 'No keys'}\n")
            f.write(f"request.data: {request.data}\n")
            f.write(f"json_data type: {type(json_data)}\n")
            f.write(f"json_data: {str(json_data)[:200]}\n")

        if file is None and not json_data:
            return Response(
                {"error": "No file or data uploaded, or dataset is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if file:
                # 🔥 Read Excel file
                df = pd.read_excel(file)
                original_data = json.loads(df.to_json(orient='records', date_format='iso'))
            else:
                # Use provided JSON data
                original_data = json_data

            # Clean data
            cleaned_data = clean_dataset(original_data)
            # cleaned_data = json.loads(df.to_json(orient='records', date_format='iso'))

            # Save to DB
            dataset = Dataset.objects.create(
                user=request.user,
                original_data=original_data,
                cleaned_data=cleaned_data
            )

            serializer = DatasetSerializer(dataset)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": "Processing failed", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class UserDatasetListView(generics.ListAPIView):
    serializer_class = DatasetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Dataset.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

class MultipleLinearRegressionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        independent_vars = request.data.get("independent_vars")
        dependent_var = request.data.get("dependent_var")
        data = request.data.get("data")
        missing_values = request.data.get("missing_values", "drop")

        if not all([independent_vars, dependent_var, data]):
            return Response({"error": "Missing required parameters: independent_vars, dependent_var, and data"}, 
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            results = perform_regression_analysis(independent_vars, dependent_var, data, missing_values)
            
            # Store in database
            AnalysisResult.objects.create(
                user=request.user,
                analysis_type='regression',
                input_params={
                    "independent_vars": independent_vars,
                    "dependent_var": dependent_var,
                    "missing_values": missing_values
                },
                output_results=results
            )

            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PCAAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.get("data")
        selected_columns = request.data.get("selected_columns")
        n_components = request.data.get("n_components")
        variance_threshold = request.data.get("variance_threshold")
        missing_values = request.data.get("missing_values", "drop")

        if not all([data, selected_columns]):
            return Response({"error": "Missing required parameters: data and selected_columns"}, 
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            results = perform_pca_analysis(
                data, 
                selected_columns, 
                n_components=n_components, 
                variance_threshold=variance_threshold, 
                missing_values=missing_values
            )

            # Store in database
            AnalysisResult.objects.create(
                user=request.user,
                analysis_type='pca',
                input_params={
                    "selected_columns": selected_columns,
                    "n_components": n_components,
                    "variance_threshold": variance_threshold,
                    "missing_values": missing_values
                },
                output_results=results
            )

            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BasicAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.get("data")

        if not data:
            return Response({"error": "Missing required parameter: data"}, 
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            results = perform_basic_analysis(data)

            # Store in database
            AnalysisResult.objects.create(
                user=request.user,
                analysis_type='basic',
                input_params={},
                output_results=results
            )

            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeacherDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Forbidden'}, status=403)

        surveys = InstructorSurvey.objects.filter(teacher=request.user)
        data = []

        for survey in surveys:
            # using related_name 'student_surveys' from StudentSurvey model
            responses = survey.student_surveys.all()
            published  = responses.filter(is_published=True).count()
            saved      = responses.filter(is_published=False).count()

            # Example aggregated stats (add more as needed)
            # pyrefly: ignore [missing-import]
            from django.db.models import Avg
            avg_engage = responses.aggregate(
                avg=Avg('total_engage_score_s')
            )['avg']

            data.append({
                'id':           survey.id,
                'course_code':  survey.course_code,
                'course_name':  survey.q4_course,
                'semester':     survey.q3_semester,
                'status':       survey.status,
                'total_responses':     responses.count(),
                'published_responses': published,
                'saved_responses':     saved,
                'avg_engagement':      round(avg_engage, 2) if avg_engage else None,
            })

        # Also tell frontend if teacher has filled any survey at all
        has_survey = surveys.exists()

        return Response({'has_survey': has_survey, 'courses': data})

# ─────────────────────────────────────────────────────────────────────────────
# SURVEY VIEWS
# ─────────────────────────────────────────────────────────────────────────────

class InstructorSurveyView(APIView):
    """GET list / POST create — teacher must be authenticated."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        surveys = InstructorSurvey.objects.filter(teacher=request.user).order_by('-created_at')
        return Response(InstructorSurveySerializer(surveys, many=True).data)

    def post(self, request):
        serializer = InstructorSurveySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(teacher=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InstructorSurveyDetailView(APIView):
    """GET one / PATCH update — teacher must own the survey."""
    permission_classes = [IsAuthenticated]

    def _get_survey(self, pk, user):
        try:
            return InstructorSurvey.objects.get(pk=pk, teacher=user)
        except InstructorSurvey.DoesNotExist:
            return None

    def get(self, request, pk):
        survey = self._get_survey(pk, request.user)
        if not survey:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(InstructorSurveySerializer(survey).data)

    def patch(self, request, pk):
        survey = self._get_survey(pk, request.user)
        if not survey:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = InstructorSurveySerializer(survey, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublishInstructorSurveyView(APIView):
    """POST — set status=published and return the course_code."""
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            survey = InstructorSurvey.objects.get(pk=pk, teacher=request.user)
        except InstructorSurvey.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        survey.status = InstructorSurvey.STATUS_PUBLISHED
        survey.save()
        return Response({'message': 'Survey published.', 'course_code': survey.course_code})


class StudentSurveyLookupView(APIView):
    """GET ?course_code=XXXX — anonymous; returns teacher/course info for confirmation."""
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.query_params.get('course_code', '').strip().upper()
        if not code:
            return Response({'error': 'course_code is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            survey = InstructorSurvey.objects.get(course_code=code, status=InstructorSurvey.STATUS_PUBLISHED)
        except InstructorSurvey.DoesNotExist:
            return Response({'error': 'Invalid or unpublished course code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'survey_id':      survey.id,
            'course_code':    survey.course_code,
            'instructor_name': survey.q1_name,
            'course_name':    survey.q4_course,
            'department':     survey.q2_university,
            'semester':       survey.q3_semester,
            'year':           survey.year,
        })


class StudentSurveySubmitView(APIView):
    """POST — anonymous student submits survey; returns edit_token."""
    permission_classes = [AllowAny]

    def post(self, request):
        course_code = request.data.get('course_code', '').strip().upper()
        try:
            instructor_survey = InstructorSurvey.objects.get(
                course_code=course_code, status=InstructorSurvey.STATUS_PUBLISHED
            )
        except InstructorSurvey.DoesNotExist:
            return Response({'error': 'Invalid or unpublished course code.'}, status=status.HTTP_404_NOT_FOUND)

        is_publishing = request.data.get('publish', False)

        # Strip course_code from data before passing to serializer
        data = {k: v for k, v in request.data.items() if k != 'course_code'}
        data['instructor_survey'] = instructor_survey.id
        data['is_published']      = is_publishing

        # Copy metadata fields from instructor survey
        data['q1_name'] = ""
        data['q108_email'] = ""
        data['q2_university'] = instructor_survey.q2_university
        data['q109_location'] = instructor_survey.q109_location
        data['q3_semester'] = instructor_survey.q3_semester
        data['q3_4_text'] = instructor_survey.q3_4_text
        data['q4_course'] = instructor_survey.q4_course
        data['q111_degree_level'] = instructor_survey.q111_degree_level
        data['q104_student_count'] = instructor_survey.q104_student_count
        data['q105_class_format'] = instructor_survey.q105_class_format
        data['q107_1_online_pct'] = instructor_survey.q107_1_online_pct
        data['q6_2_text'] = instructor_survey.q1_name  # professor name
        data['q6_role'] = 'Student'
        data['year'] = instructor_survey.year

        serializer = StudentSurveySerializer(data=data)
        if serializer.is_valid():
            instance = serializer.save(instructor_survey=instructor_survey)
            return Response({
                'message':    'Survey submitted.',
                'id':           instance.id,
                'edit_token': str(instance.edit_token),
                'is_published': instance.is_published,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentSurveyEditView(APIView):
    """GET / PUT — retrieve or update a student submission via edit_token."""
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            survey = StudentSurvey.objects.get(edit_token=token)
        except (StudentSurvey.DoesNotExist, ValueError):
            return Response({'error': 'Invalid or expired edit token.'}, status=status.HTTP_404_NOT_FOUND)

        if survey.is_published:
            return Response({'error': 'This response has been published and cannot be edited.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(StudentSurveySerializer(survey).data)

    def put(self, request, token):
        try:
            survey = StudentSurvey.objects.get(edit_token=token)
        except (StudentSurvey.DoesNotExist, ValueError):
            return Response({'error': 'Invalid edit token.'}, status=status.HTTP_404_NOT_FOUND)

        if survey.is_published:
            return Response({'error': 'Published responses cannot be edited.'}, status=status.HTTP_403_FORBIDDEN)

        is_publishing = request.data.get('publish', False)
        serializer = StudentSurveySerializer(survey, data=request.data, partial=True)
        
        if serializer.is_valid():
            instance = serializer.save()
            if is_publishing:
                instance.is_published = True
                instance.save(update_fields=['is_published'])
            return Response({
                'id':           instance.id,
                'edit_token':   str(instance.edit_token),
                'is_published': instance.is_published,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminSurveyListView(APIView):
    """GET — admin sees all surveys grouped by teacher with completion metrics."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        surveys = InstructorSurvey.objects.select_related('teacher').all().order_by('-created_at')
        
        teachers_map = {}
        for s in surveys:
            t = s.teacher
            t_id = t.id
            if t_id not in teachers_map:
                teachers_map[t_id] = {
                    'teacher_id': t_id,
                    'teacher_email': t.email,
                    'teacher_name': s.q1_name or t.username,
                    'surveys': []
                }
            
            completed_students = s.student_surveys.filter(is_published=True).count()
            uncompleted_students = s.student_surveys.filter(is_published=False).count()
            
            teachers_map[t_id]['surveys'].append({
                'id': s.id,
                'course_code': s.course_code,
                'course_name': s.q4_course or 'Unnamed Course',
                'semester': s.q3_semester,
                'year': getattr(s, 'year', ''),
                'status': s.status,
                'instructor_completed': s.status == InstructorSurvey.STATUS_PUBLISHED,
                'completed_student_count': completed_students,
                'uncompleted_student_count': uncompleted_students
            })
            
        return Response(list(teachers_map.values()))


class AdminSurveyDetailView(APIView):
    """GET — Retrieve complete instructor survey answers and listing of student responses."""
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        try:
            survey = InstructorSurvey.objects.select_related('teacher').get(pk=pk)
        except InstructorSurvey.DoesNotExist:
            return Response({'error': 'Survey not found'}, status=status.HTTP_404_NOT_FOUND)

        student_responses = survey.student_surveys.all().order_by('-submitted_at')
        
        return Response({
            'instructor_survey': InstructorSurveySerializer(survey).data,
            'students_completed': StudentSurveySerializer(student_responses.filter(is_published=True), many=True).data,
            'students_drafts': StudentSurveySerializer(student_responses.filter(is_published=False), many=True).data,
        })


import pandas as pd
import io
# pyrefly: ignore [missing-import]
from django.http import HttpResponse

class AdminSurveyExportView(APIView):
    """GET — Export all survey responses as an Excel file with two sheets."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            export_type = request.GET.get('type')
            
            if export_type == 'instructor':
                data = InstructorSurvey.objects.filter(status='published').values()
                df = pd.DataFrame(list(data))
                if df.empty:
                    df = pd.DataFrame(columns=["id", "teacher_id", "course_code"])
                filename = 'instructor_responses.xlsx'
                sheet = 'Instructors'
            elif export_type == 'student':
                data = StudentSurvey.objects.filter(is_published=True).values()
                df = pd.DataFrame(list(data))
                if df.empty:
                    df = pd.DataFrame(columns=["id", "course_code"])
                filename = 'student_responses.xlsx'
                sheet = 'Students'
            else:
                return Response({"error": "Invalid or missing type parameter"}, status=status.HTTP_400_BAD_REQUEST)

            # Convert timezone-aware datetimes to timezone-unaware
            for col in df.columns:
                if pd.api.types.is_datetime64_any_dtype(df[col]):
                    df[col] = df[col].dt.tz_localize(None)

            buffer = io.BytesIO()
            with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name=sheet, index=False)

            buffer.seek(0)
            
            response = HttpResponse(
                buffer.read(),
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return Response(
                {"error": f"Failed to export surveys: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminSurveyToDatasetView(APIView):
    """POST — Retrieve surveys as raw data to populate the Upload table."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        try:
            convert_type = request.GET.get('type')
            if not convert_type:
                return Response({"error": "Missing type parameter"}, status=status.HTTP_400_BAD_REQUEST)
                
            dataset = None
            
            if convert_type == 'instructor':
                instructors = InstructorSurvey.objects.filter(status='published').values()
                df = pd.DataFrame(list(instructors))
                name = "Instructor Responses (Auto-Generated)"
                desc = "Imported from published instructor surveys."
            elif convert_type == 'student':
                students = StudentSurvey.objects.filter(is_published=True).values()
                df = pd.DataFrame(list(students))
                name = "Student Responses (Auto-Generated)"
                desc = "Imported from published student surveys."
            else:
                return Response({"error": "Invalid type parameter"}, status=status.HTTP_400_BAD_REQUEST)

            if df.empty:
                return Response({"error": "No data found for the selected survey type"}, status=status.HTTP_404_NOT_FOUND)

            # Convert datetimes
            for col in df.columns:
                if pd.api.types.is_datetime64_any_dtype(df[col]):
                    df[col] = df[col].astype(str)

            data_dict = df.to_dict(orient='records')
            
            return Response({
                "message": f"{name} retrieved successfully.",
                "data": data_dict,
                "columns": list(df.columns),
                "name": name
            })
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve survey dataset: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )