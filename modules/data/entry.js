import {
MIN_STRESS_LEVEL,
MAX_STRESS_LEVEL,
MIN_SLEEP_QUALITY,
MAX_SLEEP_QUALITY
} from './constants.js';

export class Entry {
  constructor(data) {
    // Validate and freeze at creation
    this.datum = data.datum;
    this.aufstehzeit = data.aufstehzeit;
    this.schlafenszeit = data.schlafenszeit;
    this.stresslevel = Number(data.stresslevel);
    this.schlafqualitat = Number(data.schlafqualitat);
    
    if (!this.isValid()) {
      throw new Error('Invalid Entry data');
    }
    
    // Immutable after creation
    Object.freeze(this);
  }

  isValid() {
    return Number.isInteger(this.stresslevel) && 
           this.stresslevel >= MIN_STRESS_LEVEL && 
           this.stresslevel <= MAX_STRESS_LEVEL &&
           Number.isInteger(this.schlafqualitat) && 
           this.schlafqualitat >= MIN_SLEEP_QUALITY && 
           this.schlafqualitat <= MAX_SLEEP_QUALITY;
  }

  // Factory for safe creation
  static create(data) {
    try {
      return new Entry(data);
    } catch {
      return null;
    }
  }

  // For CSV export
  toArray() {
    return [
      this.datum,
      this.aufstehzeit, 
      this.schlafenszeit,
      this.stresslevel,
      this.schlafqualitat
    ];
  }
}