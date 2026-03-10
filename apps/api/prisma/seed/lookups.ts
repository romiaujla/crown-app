type LookupKind =
  | "organization"
  | "location"
  | "person"
  | "role"
  | "asset"
  | "load"
  | "stop";

export class SeedLookupStore {
  private readonly organizations = new Map<string, string>();
  private readonly locations = new Map<string, string>();
  private readonly people = new Map<string, string>();
  private readonly roles = new Map<string, string>();
  private readonly assets = new Map<string, string>();
  private readonly loads = new Map<string, string>();
  private readonly stops = new Map<string, string>();

  setOrganization(code: string, id: string): void {
    this.organizations.set(code, id);
  }

  setLocation(code: string, id: string): void {
    this.locations.set(code, id);
  }

  setPerson(code: string, id: string): void {
    this.people.set(code, id);
  }

  setRole(code: string, id: string): void {
    this.roles.set(code, id);
  }

  setAsset(code: string, id: string): void {
    this.assets.set(code, id);
  }

  setLoad(code: string, id: string): void {
    this.loads.set(code, id);
  }

  setStop(loadCode: string, stopSequence: number, id: string): void {
    this.stops.set(`${loadCode}:${stopSequence}`, id);
  }

  getOrganization(code: string): string {
    return this.getRequired("organization", code, this.organizations);
  }

  getLocation(code: string): string {
    return this.getRequired("location", code, this.locations);
  }

  getPerson(code: string): string {
    return this.getRequired("person", code, this.people);
  }

  getRole(code: string): string {
    return this.getRequired("role", code, this.roles);
  }

  getAsset(code: string): string {
    return this.getRequired("asset", code, this.assets);
  }

  getLoad(code: string): string {
    return this.getRequired("load", code, this.loads);
  }

  getStop(loadCode: string, stopSequence: number): string {
    return this.getRequired("stop", `${loadCode}:${stopSequence}`, this.stops);
  }

  private getRequired(kind: LookupKind, key: string, map: Map<string, string>): string {
    const value = map.get(key);
    if (!value) {
      throw new Error(`Missing ${kind} lookup for ${key}`);
    }

    return value;
  }
}
