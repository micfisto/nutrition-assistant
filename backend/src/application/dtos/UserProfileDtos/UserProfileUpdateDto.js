export class UserProfileUpdateDto {
    constructor(payload = {}) {
        this.birthDate = payload.birthDate !== undefined ? payload.birthDate : undefined;
        this.weight = payload.weight !== undefined ? Number(payload.weight) : undefined;
        this.height = payload.height !== undefined ? Number(payload.height) : undefined;
    }
}