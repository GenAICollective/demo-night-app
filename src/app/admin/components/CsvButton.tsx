import { parse } from "csv-parse";
import { ArrowDownToLine, ArrowUpFromLine, FileText } from "lucide-react";
import { CSVLink } from "react-csv";
import { type CommonPropTypes } from "react-csv/components/CommonPropTypes";
import { useDropzone } from "react-dropzone";

import { cn } from "~/lib/utils";

import Button from "~/components/Button";
import { useModal } from "~/components/modal/provider";

type CsvButtonProps<T extends string> = CommonPropTypes & {
  headers: T[];
  onUpload: (rows: Record<T, string>[]) => void;
};

export default function CsvButton<T extends string>(props: CsvButtonProps<T>) {
  const modal = useModal();

  return (
    <button
      className="group flex h-full flex-row items-center gap-1 rounded-xl bg-blue-200 p-2 font-semibold text-black outline-none transition-all hover:bg-blue-300"
      title="Upload + download CSV"
      onClick={() => modal?.show(<CsvModal {...props} />)}
    >
      <FileText className="h-[14px] w-[14px]" strokeWidth={2.5} /> CSV
    </button>
  );
}

export function CsvModal<T extends string>(props: CsvButtonProps<T>) {
  const modal = useModal();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (file.type !== "text/csv") {
        alert("Please upload a CSV file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        parse(
          text as string,
          {
            columns: true,
            delimiter: ",",
          },
          (err, records) => {
            if (err) {
              alert(err);
              return;
            }
            props.onUpload(records);
            modal?.hide();
          },
        );
      };
      reader.readAsText(file);
    },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-center text-2xl font-bold">Upload + Download CSV</h1>
      <CSVLink
        className="w-full"
        data={props.data}
        headers={props.headers}
        filename={props.filename}
      >
        <button className="flex w-full flex-row items-center justify-center gap-1 rounded-xl bg-gray-200 p-3 font-semibold outline-none transition-all hover:bg-gray-300 focus:outline-none">
          <ArrowDownToLine className="h-[14px] w-[14px]" strokeWidth={3} />
          Download CSV
        </button>
      </CSVLink>
      <div
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-4 py-6 text-center font-medium text-gray-400 transition-all duration-300 hover:text-gray-500",
          isDragActive && "border-gray-400 bg-gray-100",
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p className="flex flex-row items-center gap-1">
          <ArrowUpFromLine className="h-[14px] w-[14px]" strokeWidth={3} />{" "}
          {isDragActive ? "Drop CSV here" : "Click to upload CSV"}
        </p>
        <p className="text-sm">(cols: {props.headers?.join(", ")})</p>
      </div>
      <Button onClick={() => modal?.hide()}>Done</Button>
    </div>
  );
}
