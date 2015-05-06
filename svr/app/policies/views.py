from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.shortcuts import render, get_object_or_404, redirect

from .models import Topic, Policy
from .forms import EvidenceForm, PolicyForm

def topic_list(request):
    open_topics = Topic.objects.open()
    closed_topics = Topic.objects.closed()
    return render(request, 'topic_list.html', {
            'breadcrumbs': [
                {
                    'label': 'Debates',
                    'url_name': 'policies_topic_list',
                    'pk': None
                }
            ],
            'open_topics': open_topics,
            'closed_topics': closed_topics
        }
    )

def topic_detail(request, topic_id):
    topic = get_object_or_404(Topic, pk=topic_id)
    evidence = sorted(topic.evidence.all(), key=lambda v: v.vote_count, reverse=True)
    policies = sorted(topic.policies.open(), key=lambda v: v.vote_count, reverse=True)
    closed_policies = topic.policies.closed()
    return render(request, 'topic_detail.html', {
            'breadcrumbs': [
                {
                    'label': 'Debates',
                    'url_name': 'policies_topic_list',
                    'pk': None
                },
                {
                    'label': topic.name,
                    'url_name': 'policies_topic_detail',
                    'pk': topic.pk
                }
            ],
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
            'breadcrumbs': [
                {
                    'label': 'Policies',
                    'url_name': 'policies_policy_list',
                    'pk': None
                },
            ],
            'open_policies': open_policies,
            'closed_policies': closed_policies
        }
    )

def policy_detail(request, policy_id):
    policy = get_object_or_404(Policy, pk=policy_id)
    topic = policy.topic
    supporting_evidence = policy.evidence
    return render(request, 'policy_detail.html', {
            'breadcrumbs': [
                {
                    'label': 'Debates',
                    'url_name': 'policies_topic_list',
                    'pk': None
                },
                {
                    'label': topic.name,
                    'url_name': 'policies_topic_detail',
                    'pk': topic.pk
                },
                {
                    'label': policy.name,
                    'url_name': 'policies_policy_detail',
                    'pk': policy.pk
                }
            ],
            'topic': topic,
            'policy': policy,
            'supporting_evidence': supporting_evidence
        }
    )

@login_required
def policy_add(request, topic_id):
    topic = get_object_or_404(Topic, pk=topic_id)
    if request.method == 'POST':
        form = PolicyForm(request.POST)
        if form.is_valid():
            form.save()
            messages.info(request, "Your policy has been added")
            return redirect(reverse('policies_topic_detail', args=(topic_id)))
        else:
            messages.warning(request, "Something went wrong, we couldn't add that")
    else:
        form = PolicyForm(initial={'topic': topic})
    return render(request, 'policy_add.html', {
            'breadcrumbs': [
                {
                    'label': 'Debates',
                    'url_name': 'policies_topic_list',
                    'pk': None
                },
                {
                    'label': topic.name,
                    'url_name': 'policies_topic_detail',
                    'pk': topic.pk
                },
                {
                    'label': 'Add Policy',
                    'url_name': 'policies_policy_add',
                    'pk': topic.pk
                },
            ],
            'topic': topic,
            'form': form,
        }
    )

@login_required
def evidence_add(request, topic_id):
    topic = get_object_or_404(Topic, pk=topic_id)
    if request.method == 'POST':
        form = EvidenceForm(request.POST)
        if form.is_valid():
            form.save()
            messages.info(request, "Your evidence has been added")
            return redirect(reverse('policies_topic_detail', args=(topic_id)))
        else:
            messages.warning(request, "Something went wrong, we couldn't add that")
    else:
        form = EvidenceForm(initial={'topic': topic})
    return render(request, 'evidence_add.html', {
            'breadcrumbs': [
                {
                    'label': 'Debates',
                    'url_name': 'policies_topic_list',
                    'pk': None
                },
                {
                    'label': topic.name,
                    'url_name': 'policies_topic_detail',
                    'pk': topic.pk
                },
                {
                    'label': 'Add Evidence',
                    'url_name': 'policies_evidence_add',
                    'pk': topic.pk
                },
            ],
            'topic': topic,
            'form': form,
        }
    )