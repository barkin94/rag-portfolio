import { google } from 'googleapis';
import config from './config';
import logger from '@/logger';

function getDriveClient() {
  const credentials = JSON.parse(
    Buffer.from(config.GOOGLE_SERVICE_ACCOUNT_JSON, "base64").toString("utf-8"),
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

export async function fetchResume(): Promise<string> {
  try {
    const drive = await getDriveClient();

    const response  = await drive.files.export(
      {
        fileId: config.GOOGLE_DOC_ID,
        mimeType: "text/plain",
      },
      { responseType: "text" },
    );

    return response.data as string
  } catch (error) {
    logger.error(
      { error, docId: config.GOOGLE_DOC_ID },
      "Failed to fetch Google Doc",
    );
    throw new Error(
      `Failed to fetch Google Doc: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
