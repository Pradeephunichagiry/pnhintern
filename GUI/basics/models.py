from django.db import models

# Create your models here.
class Employee_Table(models.Model):
    EMP_name = models.CharField(max_length=500)
    EMP_DES= models.CharField(max_length=500)
    EMP_place = models.CharField(max_length=500)
    EMP_age = models.IntegerField()
    EMP_salary = models.FloatField()

class student_Table(models.Model):
    name = models.CharField(max_length=500)
    usn= models.CharField(max_length=500)
    branch = models.CharField(max_length=500)
    sem= models.CharField(max_length=500)
    phn_no = models.IntegerField()
    email = models.EmailField()
