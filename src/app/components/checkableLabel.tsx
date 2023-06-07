import { Suspense } from "react";
import { CheckedLabel } from "./checkedLabel";

type CheckableLabelParams = {
  labelText?: string;
  uncheckedLabelClassNames?: string;
  checkedLabelClassNames?: string;
  checkSize: string;
  resolvingPromise: Promise<boolean>;
};

export function CheckableLabel(
  props: CheckableLabelParams
) {
  const defaultElement = (
    <span className={props.uncheckedLabelClassNames}>
      {props.labelText}
    </span>
  );
  const shouldBeChecked = props.resolvingPromise;

  return (
    <div className="flex items-center">
      <Suspense fallback={defaultElement}>
        {shouldBeChecked.then((value) => {
          return value ? (
            <CheckedLabel
              checkSize={props.checkSize}
              classNames={props.checkedLabelClassNames}
              labelText={props.labelText}
            />
          ) : (
            defaultElement
          );
        })}
      </Suspense>
    </div>
  );
}
