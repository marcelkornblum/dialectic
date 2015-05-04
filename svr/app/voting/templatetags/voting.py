from django import template

register = template.Library()

@register.inclusion_tag('vote_widget.html', takes_context=True)
def vote_widget(context, generic_object):
    existing_upvote = False
    existing_downvote = False
    existing_user_vote = generic_object.get_vote_for_user(context['request'].user)
    if existing_user_vote is not None:
        if existing_user_vote.is_upvote is True:
            existing_upvote = True
        else:
            existing_downvote = True
    app_name = generic_object._meta.app_label
    model_name = generic_object._meta.model_name
    object_id = generic_object.pk
    votes = generic_object.vote_count
    return {
        'path': context['request'].path,
        'app_name': app_name,
        'model_name': model_name,
        'object_id': object_id,
        'votes': votes,
        'existing_upvote': existing_upvote,
        'existing_downvote': existing_downvote,
    }