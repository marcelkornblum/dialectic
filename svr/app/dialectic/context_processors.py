from django.conf import settings # import the settings file

def page_title(request):
    return {'DEFAULT_PAGE_TITLE': settings.DEFAULT_PAGE_TITLE}