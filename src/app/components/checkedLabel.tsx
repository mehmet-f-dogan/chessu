import { BsFillCheckCircleFill } from "react-icons/bs";

type CheckedLabelParams = {
  labelText?: string;
  classNames?: string;
  checkSize: string;
};

export function CheckedLabel(props: CheckedLabelParams) {
  return (
    <div className="flex items-center">
      <span className={props.classNames}>
        {props.labelText}
      </span>
      <BsFillCheckCircleFill
        className={"mx-2 text-lime-500 " + props.checkSize}
      />
    </div>
  );
}
