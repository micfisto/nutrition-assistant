export class InMemoryUserProfileRepository {
  #profiles = new Map();

  async findById(id) {
    return this.#profiles.get(id) || null;
  }

  async findByUserId(userId) {
    for (const profile of this.#profiles.values()) {
      if (profile.userId === userId) {
        return profile;
      }
    }
    return null;
  }

  async findAll() {
    return Array.from(this.#profiles.values());
  }

  async save(profile) {
    this.#profiles.set(profile.id, profile);
    return profile;
  }

  async delete(id) {
    this.#profiles.delete(id);
  }
}
