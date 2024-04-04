import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import { FC } from "react";

interface ContactDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ContactDialog: FC<ContactDialogProps> = ({ open, setOpen }) => {
  return (
    <Modal
      isOpen={open}
      onOpenChange={setOpen}
      size="sm"
      classNames={{
        base: "bg-white dark:bg-neutral-700",
        header: "flex items-center justify-center gap-2",
        body: "text-center",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <div className="mb-4 flex justify-center">
                <Image
                  src={`https://jsy.tw/img/my-photo.9e8c500f.jpg`}
                  alt="jsy-photo"
                  width={150}
                  height={150}
                  className="rounded-full"
                />
              </div>
              <div className="mb-2 text-center text-xl font-bold">JS Ying</div>
              <div className="text-zinc-500 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>
                  信箱：jsying1994@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={`https://jsy.tw/logo.png`}
                    alt={`jsy-logo`}
                    width={19}
                    height={19}
                  />
                  <span>
                    個人網站：
                    <a href="https://jsy.tw/" target="_blank" rel="noreferrer">
                      https://jsy.tw
                    </a>
                  </span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ContactDialog;
