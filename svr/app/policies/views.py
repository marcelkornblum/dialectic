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
    evidence = topic.evidence.all()
    policies = topic.policies.open()
    closed_policies = topic.policies.closed()
    return render(request, 'topic_detail.html', {
            'topic': topic,
            'evidence': evidence,
            'policies': policies,
            'closed_policies': closed_policies
        }
    )

def policy_list(request):
    open_policies = Policy.objects.open()
    closed_policies = Policy.objects.closed()
    return render(request, 'policy_list.html', {
            'open_policies': open_policies,
            'closed_policies': closed_policies
        }
    )

def policy_detail(request, policy_id):
    policy = get_object_or_404(Policy, pk=policy_id)
    return render(request, 'policy_detail.html', {
            'policy': policy,
        }
    )