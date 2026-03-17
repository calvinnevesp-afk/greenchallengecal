/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: classementetudiants
 * Interface for Classementtudiants
 */
export interface Classementtudiants {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  studentName?: string;
  /** @wixFieldType text */
  lastName?: string;
  /** @wixFieldType text */
  firstName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePicture?: string;
  /** @wixFieldType text */
  studentClass?: string;
  /** @wixFieldType number */
  points?: number;
  /** @wixFieldType number */
  rankPosition?: number;
}


/**
 * Collection ID: defisrse
 * Interface for DfisRSE
 */
export interface DfisRSE {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  challengeTitle?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  illustration?: string;
  /** @wixFieldType date */
  publishDate?: Date | string;
  /** @wixFieldType time */
  publishTime?: any;
}


/**
 * Collection ID: messagescontact
 * Interface for MessagesdeContact
 */
export interface MessagesdeContact {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  senderName?: string;
  /** @wixFieldType text */
  senderEmail?: string;
  /** @wixFieldType text */
  subject?: string;
  /** @wixFieldType text */
  messageContent?: string;
  /** @wixFieldType datetime */
  submissionDate?: Date | string;
  /** @wixFieldType boolean */
  isRead?: boolean;
}
