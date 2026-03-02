"""
URL configuration for GUI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from basics.views import *


urlpatterns = [
    path("admin/", admin.site.urls),
    path("abc/",abc, name="abc"),
    path("led/",led, name="led"),
    path("counter/",counter, name="counter"),
    path("calci/",calci_view, name="calci"),
    path("callci/",callci_view, name="callci"),
    path("login/",login_view, name="login"),
    path("Employee/",Employee, name="Employee"),
    path("student/",student, name="student"),
    path("Employee_view/",Employee_view, name="Employee_view"),
    path("Employee_update/<id>/",Employee_update, name="Employee_update"),
    path("student_view/", student_view, name="student_view"),
    path("student_update/<id>/", student_update, name="student_update"),
    path("Employee_delete/<id>/", Employee_delete, name="Employee_delete"),
    path("student_delete/<id>/", student_delete, name="student_delete"),
    path("index/",index, name="index"),
    path("signup/",signupPage, name="signup"),
    path("logout/",logoutPage, name="logout"),
    
]
