from django import forms

from .models import Evidence, Policy

class EvidenceForm(forms.ModelForm):
    class Meta:
        model = Evidence
        fields = [
            'url',
            'file',
            'name',
            'attribution',
            'summary',
            'description',
            'topic'
        ]
        widgets = {
            'topic': forms.HiddenInput
        }

    def clean(self):
        cleaned_data = super(EvidenceForm, self).clean()
        url = cleaned_data.get('url')
        file_upload = cleaned_data.get('file')
        if not url or file_upload:
            raise forms.ValidationError("You must either upload a file or enter a URL")

class PolicyForm(forms.ModelForm):
    class Meta:
        model = Policy
        fields = [
            'name',
            'summary',
            'description',
            'topic'
        ]
        widgets = {
            'topic': forms.HiddenInput
        }

    def save(self, *args, **kwargs):
        policy = super(PolicyForm, self).save(*args, **kwargs)
        policy.open()
        policy.save()