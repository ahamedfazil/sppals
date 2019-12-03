import * as React from "react";
import { Panel } from "office-ui-fabric-react/lib/Panel";
import { PanelFooter } from "./form/PanelFooter";
import { ISkillMatrix } from "../models/ISkillMatrix";

const buttonStyles = { root: { marginRight: 8 } };

interface ISkillMatrixPanelProps {
  isOpen: boolean;
  isCapability: boolean;
  values: ISkillMatrix[];
}

interface ISkillMatrixPanelState {
  isDismissed: boolean;
}

export default class SkillMatrixPanel extends React.Component<
  ISkillMatrixPanelProps,
  ISkillMatrixPanelState
> {
  constructor(props: ISkillMatrixPanelProps) {
    super(props);
    this.state = {
      isDismissed: false
    };
  }

  public render(): React.ReactElement<ISkillMatrixPanelProps> {
    return (
      <div>
        <Panel
          isOpen={this.props.isOpen}
          headerText="Panel with footer at bottom"
          closeButtonAriaLabel="Close"
          onRenderFooterContent={() => <PanelFooter />}
          // Stretch panel content to fill the available height so the footer is positioned
          // at the bottom of the page
          isFooterAtBottom={true}
        >
          <span>Content goes here.</span>
        </Panel>
      </div>
    );
  }
}

// = () => {
//   const [isOpen, setIsOpen] = React.useState(false);

//   const openPanel = useConstCallback(() => setIsOpen(true));
//   const dismissPanel = useConstCallback(() => setIsOpen(false));

//   // This panel doesn't actually save anything; the buttons are just an example of what
//   // someone might want to render in a panel footer.
//   const onRenderFooterContent = useConstCallback(() => (
//     <div>
//       <PrimaryButton onClick={dismissPanel} styles={buttonStyles}>
//         Save
//       </PrimaryButton>
//       <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
//     </div>
//   ));

//   return (
//     <div>
//       <DefaultButton text="Open panel" onClick={openPanel} />
//       <Panel
//         isOpen={isOpen}
//         onDismiss={dismissPanel}
//         headerText="Panel with footer at bottom"
//         closeButtonAriaLabel="Close"
//         onRenderFooterContent={onRenderFooterContent}
//         // Stretch panel content to fill the available height so the footer is positioned
//         // at the bottom of the page
//         isFooterAtBottom={true}
//       >
//         <span>Content goes here.</span>
//       </Panel>
//     </div>
//   );
// };
