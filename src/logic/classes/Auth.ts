export default class Auth {
  id: string;
  token: string;
  refresh_token: string;
  expiration: string;
  role: string;
  email: string;
  photo: string;
  name: string;
  is_logged: boolean;

  constructor(
    id: string,
    token: string,
    refresh_token: string,
    expiration: string,
    role: string,
    email: string,
    photo: string,
    name: string,
    is_logged: boolean
  ) {
    this.id = id;
    this.token = token;
    this.refresh_token = refresh_token;
    this.expiration = expiration;
    this.role = role;
    this.email = email;
    this.photo = photo;
    this.name = name;
    this.is_logged = is_logged;
  }

  setId(id: string): void {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  setRefreshToken(refresh_token: string): void {
    this.refresh_token = refresh_token;
  }

  getRefreshToken(): string {
    return this.refresh_token;
  }

  setExpiration(expiration: string): void {
    this.expiration = expiration;
  }

  getExpiration(): string {
    return this.expiration;
  }

  setRole(role: string): void {
    this.role = role;
  }

  getRole(): string {
    return this.role;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  setPhoto(photo: string): void {
    this.photo = photo;
  }

  getPhoto(): string {
    return this.photo;
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setIsLogged(is_logged: boolean): void {
    this.is_logged = is_logged;
  }

  getIsLogged(): boolean {
    return this.is_logged;
  }
}
