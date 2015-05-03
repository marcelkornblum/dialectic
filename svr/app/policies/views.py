from django.shortcuts import render, get_object_or_404
from .models import Topic, Policy

def topic_list(request):
    open_topics = Topic.objects.open()
    closed_topics = Topic.objects.closed()
    return render(request, 'topic_list.html', {
            'open_topics': open_topics,
            'closed_topics': closed_topics
        }
    )

def topic_detail(request, topic_id):
    topic = get_object_or_404(Topic, pk=topic_id)
    policies = topic.policies.open()
    closed_policies = topic.policies.closed()
    return render(request, 'topic_detail.html', {
            'topic': topic,
            'policies': policies,
            'closed_policies': closed_policies
        }
    )