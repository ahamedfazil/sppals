import { PersonCardInteraction, PersonViewType } from '@microsoft/mgt';
import { Person } from '@microsoft/mgt-react';
import { Text, Stack, Icon, ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { parseQuery } from '../utils/Utilities';
import styles from './Meetings.module.scss';


export interface MeetingsProps {
    meeting: any;
}

const Meetings: React.FC<MeetingsProps> = ({ meeting }) => {
    const viewMoreButtonRef = React.useRef(null);
    return (<div className={styles.Meeting}>
        <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
            <Text variant="mediumPlus" style={{ fontWeight: 600 }} nowrap>{meeting.subject}</Text>
        </Stack>

        <Stack className={styles.Details} horizontal horizontalAlign="space-between">
            {meeting.location && meeting.location.displayName &&
                <Stack.Item align="start">
                    <div className={styles.DetailsItem}>
                        <Icon iconName="POI" className={styles.DetailsItemContent} />
                        <Text variant="small" className={styles.DetailsItemContent}>{meeting.location.displayName}</Text>
                    </div>
                </Stack.Item>
            }

            {meeting.start && meeting.start.dateTime &&
                <Stack.Item align="center">
                    <div className={styles.DetailsItem}>
                        <Icon iconName="CalendarDay" className={styles.DetailsItemContent} />
                        <Text variant="small" className={styles.DetailsItemContent}>{new Date(meeting.start.dateTime).toLocaleDateString(undefined, {
                            month: 'long', day: 'numeric'
                        })} ({new Date(meeting.start.dateTime).toLocaleString('en-us', { weekday: 'long' })})</Text>
                    </div>
                </Stack.Item>
            }

            {meeting.end && meeting.end.dateTime &&
                <Stack.Item align="end">
                    <div className={styles.DetailsItem}>
                        <Icon iconName="Clock" className={styles.DetailsItemContent} />
                        <Text variant="small" className={styles.DetailsItemContent}>
                            {new Date(meeting.start.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} -
                            {new Date(meeting.end.dateTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </div>
                </Stack.Item>
            }
        </Stack>

        <div className={styles.Footer}>
            <div>
                <Stack horizontal tokens={{
                    childrenGap: 10,
                    padding: 5
                }}><Stack.Item grow>
                        Organizer: <Person
                            personQuery={meeting.organizer.emailAddress.address}
                            personCardInteraction={PersonCardInteraction.hover}
                            view={PersonViewType.oneline}
                            showPresence={true}
                        >
                        </Person>
                    </Stack.Item>
                </Stack>

                {meeting.onlineMeeting && meeting.onlineMeeting.joinUrl &&
                    <Stack horizontal tokens={{
                        childrenGap: 10,
                        padding: 5
                    }}>
                        <Stack.Item grow>
                            <Text variant="medium">
                                Attendees: {meeting.attendees.map((attnd: any) => {
                                    return <span style={{ marginLeft: 8 }}>
                                        <Person
                                            personQuery={attnd.emailAddress.address}
                                            personCardInteraction={PersonCardInteraction.hover}
                                            view={PersonViewType.avatar}
                                        >
                                        </Person>
                                    </span>;
                                })}
                            </Text>
                        </Stack.Item>
                    </Stack>
                }

            </div>
            <div ref={viewMoreButtonRef}>
                <Text variant="medium">
                    <Stack horizontal tokens={{
                        childrenGap: 10,
                    }}><Stack.Item grow>
                            {/* <ActionButton iconProps={{ iconName: "OutlookLogo" }} onClick={() => {
                                const url = meeting.webLink;
                                window.open(url, '_blank');
                            }}>
                                Open in outlook
                            </ActionButton> */}
                        </Stack.Item>
                    </Stack>

                    {meeting.onlineMeeting && meeting.onlineMeeting.joinUrl &&
                        <Stack horizontal tokens={{
                            childrenGap: 10,
                        }}>
                            <Stack.Item grow>
                                <ActionButton iconProps={{ iconName: "TeamsLogo" }} onClick={() => {
                                    const itemId = parseQuery(meeting.webLink)['itemid'];
                                    window.open(meeting.onlineMeeting.joinUrl, '_blank');
                                }}>
                                    Join Teams meeting
                                </ActionButton>
                            </Stack.Item>
                        </Stack>
                    }
                </Text>
            </div>
        </div>
    </div>);
};


export default Meetings;