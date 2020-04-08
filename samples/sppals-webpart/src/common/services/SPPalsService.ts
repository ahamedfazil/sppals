import { MSGraphClientFactory } from '@microsoft/sp-http';
import { ISPPalsService, IGraphEmailProps } from "../models/IServiceModel";


export class SPPalsService implements ISPPalsService {
    private msGraphClientFactory: MSGraphClientFactory;
    constructor(msGraphClientFactory: MSGraphClientFactory) {
        this.msGraphClientFactory = msGraphClientFactory;
    }

    /**
     * Send an email from current user account.
     *
     * @param emailContent email props.
     * @returns Promise boolean represents success or failure.
     */
    public sendMailSPPals = async (emailContent: IGraphEmailProps
    ): Promise<boolean> => {
        let emailAttachments = emailContent.attachments.map(attach => {
            if (!attach.isRemove) {
                return {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    name: attach.name,
                    contentBytes: attach.rawData.split("base64,")[1]
                };
            }
        });
        emailAttachments = emailAttachments.filter(emAt => emAt !== undefined);

        const emailprops = {
            message: {
                subject: emailContent.subject,
                body: {
                    contentType: "Text",
                    content: emailContent.body
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: emailContent.toEmailAddress
                        }
                    }
                ],
                attachments: emailAttachments
            },
            saveToSentItems: false
        };
        try {
            const client = await this.msGraphClientFactory.getClient();
            const isMailSent: boolean = await client.api('me/sendMail')
                .version("v1.0")
                .post(emailprops).then(() => true).catch(() => false);
            return isMailSent;
        }
        catch (e) {
            console.error("Error while sending email" + e.message);
            return false;
        }
    }

    /**
     * Returns an error message based on the specified error object
     * @param error : An error string/object
     */
    private getErrorMessage(error: any): string {
        let errorMessage: string = error.statusText
            ? error.statusText
            : error.statusMessage
                ? error.statusMessage
                : error;
        return errorMessage;
    }
}
