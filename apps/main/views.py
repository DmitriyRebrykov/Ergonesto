from django.shortcuts import render


def view_main_page(request):
    return render(request,'main/main.html')

def view_contact_page(request):
    return render(request, 'main/contacts.html')

def  detail_page(request):
    return render(request, 'main/detail.html')
