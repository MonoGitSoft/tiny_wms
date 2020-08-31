from django.forms import ModelForm
from .models import  *


class ReceivingRackageRequestForm(ModelForm):
    class Meta:
        model = ReceivingPackage
        fields = ['webshop_id', 'track_id', 'comment']

