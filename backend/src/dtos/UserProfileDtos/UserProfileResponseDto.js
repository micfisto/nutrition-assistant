export class UserProfileResponseDto {
    constructor(profile) {
        this.id = profile.id;
        this.userId = profile.userId;
        this.birthDate = profile.birthDate.toISOString().split('T')[0];
        this.age = profile.age;
        this.weight = profile.weight;
        this.height = profile.height;
        this.activityLevel = profile.activityLevel;
        this.goal = profile.goal;
        this.updatedAt = profile.updatedAt;
    }
}