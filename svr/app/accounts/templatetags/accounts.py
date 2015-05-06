from django import template

register = template.Library()

@register.inclusion_tag('account_nav.html', takes_context=True)
def account_nav(context):
    return {
        'user': context['request'].user,
    }