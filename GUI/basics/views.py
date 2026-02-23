from django.shortcuts import render

# Create your views here.
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

from django.shortcuts import render

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