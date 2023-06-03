import { BsFillCheckCircleFill } from "react-icons/bs";

export async function checkableLabel(
  labelText: string,
  uncheckedLabelClassNames: string,
  checkedLabelClassNames: string,
  checkSize: string,
  resolvingPromise: Promise<boolean>
) {
  const shouldBeChecked = await resolvingPromise;
  return (
    <div className="flex items-center">
      {shouldBeChecked ? (
        <>
          <span className={checkedLabelClassNames}>{labelText}</span>
          <BsFillCheckCircleFill
            className={"text-lime-500 mx-2 " + checkSize}
          />
        </>
      ) : (
        <span className={uncheckedLabelClassNames}>{labelText}</span>
      )}
    </div>
  );
}
