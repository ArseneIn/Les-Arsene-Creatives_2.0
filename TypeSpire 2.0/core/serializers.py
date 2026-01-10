from rest_framework import serializers
from .models import TypingSession, Student

class TypingSessionSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(write_only=True)
    
    class Meta:
        model = TypingSession
        fields = ['student_id', 'wpm', 'accuracy', 'date_recorded']
        
    def validate_student_id(self, value):
        try:
            return Student.objects.get(student_id=value)
        except Student.DoesNotExist:
            raise serializers.ValidationError("Student with this ID not found.")

    def create(self, validated_data):
        student_obj = validated_data.pop('student_id')
        return TypingSession.objects.create(student=student_obj, **validated_data)
