import { Agenda, MgtTemplateProps } from '@microsoft/mgt-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import Meetings from '../../../common/components/Meetings';

const MgtCustomTemplate: React.FC = () => {

    //#region Template component
    const EventTemplate = (props: MgtTemplateProps): JSX.Element => {
        if (props.template === "loading") {
            return <Spinner size={SpinnerSize.medium} label="Loading meetings..."></Spinner>;
        } else if (props.template === "event") {
            const { event } = props.dataContext;
            console.log("Log$: event", event);
            return <div style={{ paddingBottom: 15, maxWidth: 950 }}>
                <Meetings meeting={event} />
            </div>;
        } else if (props.template === "no-data") {
            return <div>
                No Events available
            </div>;
        } else {
            return <>Invalid template</>;
        }

    };
    //#endregion
    return (<div>
        <h3>My Agenda</h3>
        <Agenda days={14}>
            <EventTemplate template="event" />
            <EventTemplate template="no-data" />
            <EventTemplate template="loading" />
        </Agenda>
    </div>);
};

export default MgtCustomTemplate;