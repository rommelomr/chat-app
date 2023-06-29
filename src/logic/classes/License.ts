import { type iLicense } from "../interfaces/iLicense";
export class License implements iLicense {
  public id: number;
  public start_date: string;
  public finish_date: string;
  public created_at: string;
  public deleted_at: string;
  public canceled_at: string;
  public status: boolean;
  public observations: string;

  constructor(license: License) {
    this.id;
    this.setId(license.id);
    this.start_date;
    this.setStartDate(license.start_date);
    this.finish_date;
    this.setFinishDate(license.finish_date);
    this.created_at;
    this.setCreatedAt(license.created_at);
    this.deleted_at;
    this.setDeletedAt(license.deleted_at);
    this.canceled_at;
    this.setCanceledAt(license.canceled_at);
    this.status;
    this.setStatus(license.status);
    this.observations;
    this.setObservations(license.observations);
  }

  setId(id: number): void {
    this.id = id;
  }

  getId(): number {
    return this.id;
  }

  setStartDate(startDate: string): void {
    this.start_date = startDate;
  }

  getStartDate(): string {
    return this.start_date;
  }

  setFinishDate(finishDate: string): void {
    this.finish_date = finishDate;
  }

  getFinishDate(): string {
    return this.finish_date;
  }

  setCreatedAt(createdAt: string): void {
    this.created_at = createdAt;
  }

  getCreatedAt(): string {
    return this.created_at;
  }

  setDeletedAt(deletedAt: string): void {
    this.deleted_at = deletedAt;
  }

  getDeletedAt(): string {
    return this.deleted_at;
  }

  setCanceledAt(canceledAt: string): void {
    this.canceled_at = canceledAt;
  }

  getCanceledAt(): string {
    return this.canceled_at;
  }

  setStatus(status: boolean): void {
    this.status = status;
  }

  getStatus(): boolean {
    return this.status;
  }

  setObservations(observations: string): void {
    this.observations = observations;
  }

  getObservations(): string {
    return this.observations;
  }
}
