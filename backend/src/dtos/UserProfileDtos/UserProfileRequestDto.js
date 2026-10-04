export class UserProfileRequestDto {
    constructor(payload = {}) {
        this.birthDate = payload.birthDate;
        this.weight = payload.weight !== undefined ? Number(payload.weight) : undefined;
        this.height = payload.height !== undefined ? Number(payload.height) : undefined;
        this.activityLevel = payload.activityLevel;
        this.goal = payload.goal;
    }
}