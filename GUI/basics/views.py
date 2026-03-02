from django.shortcuts import render, redirect,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from .models import *
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required(login_url='/login')
def abc(request):
    return render(request,"abc.html")

def led(request):
    return render(request,"led.html")

def counter(request):
    if(request.method=="POST"):
        data=request.POST
        result=data.get("result")
        if result=="":
            result=0
        else:
            result=int(data.get("result"))

        if("increment"in request.POST):
            result+=1
            return render(request,"counter.html",context={"result":result})
        if("decrement"in request.POST):
            result=result-1
            return render(request,"counter.html",context={"result":result})
        if("reset"in request.POST):
            result=0    
            return render(request,"counter.html",context={"result":result})
    return render(request,"counter.html")



def calci_view(request):
    res = 0
    n1 = 0
    n2 = 0

    if request.method == "POST":
        n1 = int(request.POST.get('num1') or 0)
        n2 = int(request.POST.get('num2') or 0)
        operation = request.POST.get('op')

        if operation == "add":
            res = n1 + n2
        elif operation == "sub":
            res = n1 - n2
        elif operation == "mul":
            res = n1 * n2
        elif operation == "div":
            res = n1 / n2 if n2 != 0 else "Error: Div by 0"

    return render(request, 'calci.html', {'result': res, 'num1': n1, 'num2': n2})



def callci_view(request):
    result = ""
    num1 = ""
    num2 = ""

    if request.method == "POST":
        
        try:
            num1 = float(request.POST.get('num1', 0))
            num2 = float(request.POST.get('num2', 0))
            operation = request.POST.get('op')

            if operation == 'add':
                result = num1 + num2
            elif operation == 'sub':
                result = num1 - num2
            elif operation == 'mul':
                result = num1 * num2
            elif operation == 'div':
                if num2 != 0:
                    result = num1 / num2
                else:
                    result = "Error (Div by 0)"
            elif operation == 'avg':
                result = (num1 + num2) / 2
            elif operation == 'perc':
                result = (num1 / num2) * 100
            
            
            if isinstance(result, float) and result.is_integer():
                result = int(result)
                
        except ValueError:
            result = "Invalid Input"

    context = {
        'result': result,
        'num1': num1,
        'num2': num2,
    }
    return render(request, 'callci.html', context)

### login view 
def login_view(request):
    if request.method=="POST":
        username = request.POST.get("username")
        pass1 = request.POST.get("pass")
        user=User.objects.filter(username=username)
        user=authenticate(username=username,password=pass1)
        if user is not None:
            login(request,user)
            return redirect('index')
        else:
            result="invalid credentials"
            return HttpResponse("username or password is incorrect")
    return render(request, "login.html")



###EMPLOYEE TABLE VIEW
def Employee(request):
    if request.method == "POST":
        data=request.POST
        empname=data.get("EMP_name")
        empdes=data.get("EMP_DES")
        empplace=data.get("EMP_place")
        empage=data.get("EMP_age")
        empsalary=data.get("EMP_salary")
        Employee_Table.objects.create(EMP_name=empname,EMP_DES=empdes,EMP_place=empplace,EMP_age=empage,EMP_salary=empsalary)
        result="Employee Added Successfully"
        return render(request,"Employee.html",context={"result":result})
    return render(request,"Employee.html")



###STUDENT TABLE VIEW
def student(request):
    if request.method == "POST":
        data = request.POST
        name = data.get("name")
        usn = data.get("usn")
        branch = data.get("branch")
        sem = data.get("sem")
        phn_no = data.get("phn_no")
        email = data.get("email")
        student_Table.objects.create(name=name,usn=usn,branch=branch,sem=sem,phn_no=phn_no,email=email)
        result = "student Added Successfully"
        return render(request, "student.html", context={"result": result})
    return render(request, "student.html")

       



#### employee table view 
def Employee_view(request):
    getEmployee=Employee_Table.objects.all()
    return render(request,"Employee_view.html",context={"getEmployee":getEmployee})

    

### employee update view
def Employee_update(request,id):
    getEmployee=Employee_Table.objects.get(id=id)
    if request.method=="POST":
        data=request.POST
        empname=data.get("EMP_name")
        empdes=data.get("EMP_DES")
        empplace=data.get("EMP_place")
        empage=data.get("EMP_age")
        empsalary=data.get("EMP_salary")
        getEmployee.EMP_name=empname
        getEmployee.EMP_DES=empdes
        getEmployee.EMP_place=empplace
        getEmployee.EMP_age=empage
        getEmployee.EMP_salary=empsalary
        getEmployee.save()
        result="Employee Updated Successfully"
        return redirect('/Employee_view/')
    return render(request,"Employee_update.html",context={"getEmployee":getEmployee})



### student view
def student_view(request):
    getstudent=student_Table.objects.all()
    return render(request,"student_view.html",context={"getstudent":getstudent})


#### student update view
def student_update(request, id):
    getstudent = student_Table.objects.get(id=id)
    result = ""
    if request.method == "POST":
        data = request.POST
        getstudent.name = data.get("name")
        getstudent.usn = data.get("usn")
        getstudent.branch = data.get("branch")
        getstudent.sem = data.get("sem")
        getstudent.phn_no = data.get("phn_no")
        getstudent.email = data.get("email")
        getstudent.save()
        result = "updated successfully"
        return redirect('/student_view/') 
    return render(request, "student_update.html", context={"getstudent": getstudent, "result": result})




######## Employee delete view
def Employee_delete(request,id):
    getEmployee=Employee_Table.objects.get(id=id)
    if(request.method=="POST"):
        data=request.POST
        getEmployee.delete()
        return redirect('/Employee_view/')
    return render(request,"Employee_delete.html",context={'getEmployee':getEmployee})


######## student delete view
def student_delete(request, id):
    getstudent = student_Table.objects.get(id=id)
    if request.method == "POST":
        data = request.POST
        getstudent.delete()
        return redirect('/student_view/')
    return render(request, "student_delete.html", context={'getstudent': getstudent})


###     index view
def index(request):
    return render(request,"index.html")


### signup view
def signupPage(request):
    if request.method=="POST":
       username=request.POST.get("username")
       email=request.POST.get("email")
       pass1=request.POST.get("password1")
       pass2=request.POST.get("password2")

       if pass1!=pass2:
            return HttpResponse("passwords are not matching !!!")

       else:
            myuser=User.objects.create_user(username,email,pass1)
            myuser.save()
            return redirect('/login')
    return render(request,"signup.html")



## logout view
def logoutPage(request):
    logout(request)
    return redirect('/login')
