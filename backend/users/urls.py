from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# pyrefly: ignore [missing-import]
from .views import (
    RegisterView,
    ProfileView,
    AdminUserListView,
    AdminDashboardView,
    UploadDatasetView,
    MultipleLinearRegressionView,
    PCAAnalysisView,
    BasicAnalysisView,
    UserDatasetListView,
    # Survey views
    InstructorSurveyView,
    InstructorSurveyDetailView,
    PublishInstructorSurveyView,
    StudentSurveyLookupView,
    StudentSurveySubmitView,
    StudentSurveyEditView,
    AdminSurveyListView,
    TeacherDashboardView,
)

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────────
    path("register/",  RegisterView.as_view()),
    path("login/",     TokenObtainPairView.as_view()),
    path("refresh/",   TokenRefreshView.as_view()),

    # ── Normal user ───────────────────────────────────────────────────────────
    path("profile/",           ProfileView.as_view()),
    path("datasets/upload/",   UploadDatasetView.as_view()),
    path("datasets/",          UserDatasetListView.as_view()),

    # ── Analysis ──────────────────────────────────────────────────────────────
    path("analysis/regression/", MultipleLinearRegressionView.as_view()),
    path("analysis/pca/",        PCAAnalysisView.as_view()),
    path("analysis/basic/",      BasicAnalysisView.as_view()),

    # ── Admin-only (existing) ─────────────────────────────────────────────────
    path("admin/users/",     AdminUserListView.as_view()),
    path("admin/dashboard/", AdminDashboardView.as_view()),

    # ── Teacher Dashboard ─────────────────────────────────────────────────────
    path("teacher/dashboard/", TeacherDashboardView.as_view()),

    # ── Instructor Survey ─────────────────────────────────────────────────────
    path("survey/instructor/",                   InstructorSurveyView.as_view()),
    path("survey/instructor/<int:pk>/",          InstructorSurveyDetailView.as_view()),
    path("survey/instructor/<int:pk>/publish/",  PublishInstructorSurveyView.as_view()),

    # ── Student Survey (anonymous) ────────────────────────────────────────────
    path("survey/student/lookup/",               StudentSurveyLookupView.as_view()),
    path("survey/student/submit/",               StudentSurveySubmitView.as_view()),
    path("survey/student/edit/<str:token>/",     StudentSurveyEditView.as_view()),

    # ── Admin Survey View ─────────────────────────────────────────────────────
    path("admin/surveys/",   AdminSurveyListView.as_view()),
]