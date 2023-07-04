import { Suspense } from "react";
import { CheckedLabel } from "./checkedLabel";

type CheckableLabelParams = {
  labelText?: string;
  uncheckedLabelClassNames?: string;
  checkedLabelClassNames?: string;
  checkSize: string;
  shouldBeChecked: Promise<Boolean>;
};

export async function CheckableLabel(
  props: CheckableLabelParams
) {

  return (
    <div className="flex items-center">
      <Suspense fallback={
        <span className={props.uncheckedLabelClassNames}>
          {props.labelText}
        </span>
      }>
        
      </Suspense>
      {props.shouldBeChecked.then((value) => {
        if (value) {
          return (<CheckedLabel
            checkSize={props.checkSize}
            classNames={props.checkedLabelClassNames}
            labelText={props.labelText}
          />)
        }
        else {
          return (
            <span className={props.uncheckedLabelClassNames}>
              {props.labelText}
            </span>
          )
        }
      })}
    </div>
  );
}