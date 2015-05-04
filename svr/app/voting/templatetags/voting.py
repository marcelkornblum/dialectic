from django import template

register = template.Library()

@register.inclusion_tag('vote_widget.html', takes_context=True)
def vote_widget(context, generic_object):
    app_name = generic_object._meta.app_label
    model_name = generic_object._meta.model_name
    object_id = generic_object.pk
    votes = generic_object.vote_count
    return {
        'path': context['request'].path,
        'app_name': app_name,
        'model_name': model_name,
        'object_id': object_id,
        'votes': votes
    }