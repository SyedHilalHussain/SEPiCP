# from django.shortcuts import render
# from rest_framework.decorators import api_view
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Dataset
from .serializers import RegisterSerializer, UserSerializer, DatasetSerializer      
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .services.cleaning_service import clean_dataset

User = get_user_model()


#CreateAPIView internally does 
# serializer = RegisterSerializer(data=request.data)
# if serializer.is_valid():
#     serializer.save()
# else:
#     return serializer.errors

# 1️⃣ Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


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

class UploadDatasetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        file_obj = request.FILES.get('data')

        if not file_obj:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            import pandas as pd
            
            # Read excel using pandas
            df = pd.read_excel(file_obj)
            
            # Convert to list of dicts (JSON)
            original_data = df.to_dict(orient='records')
            
            # Clean dataset
            cleaned_data = clean_dataset(original_data)

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
        return Dataset.objects.filter(user=self.request.user)