from django.apps import apps
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect

@login_required
def voteup(request, app_name, model_name, object_id):
    instance = _get_instance(app_name, model_name, object_id)
    if not hasattr(instance, 'voteup'):
        raise Exception("Attempted to vote on a non-votable object")
    vote = instance.voteup(request.user)
    # add a message
    if vote.is_upvote is True:
        messages.info(request, "Your upvote has been registered")
    else:
        messages.warning(request, "Your previous vote has been cancelled")
    return redirect(_get_redirect_location(request))

@login_required
def votedown(request, app_name, model_name, object_id):
    instance = _get_instance(app_name, model_name, object_id)
    if not hasattr(instance, 'votedown'):
        raise Exception("Attempted to vote on a non-votable object")
    vote = instance.votedown(request.user)
    # add a message
    if vote.is_upvote is False:
        messages.info(request, "Your downvote has been registered")
    else:
        messages.warning(request, "Your previous vote has been cancelled")
    return redirect(_get_redirect_location(request))

def _get_instance(app_name, model_name, object_id):
    # model_ct = ContentType.objects.get(app_label=app_name, model=model_name)
    # get the model
    model = apps.get_model(app_name, model_name)
    # instantiate the object
    instance = get_object_or_404(model, pk=object_id)
    return instance

def _get_redirect_location(request):
    # http://stackoverflow.com/questions/9350990/django-redirect-to-previous-view
    return request.GET.get('next', '/')