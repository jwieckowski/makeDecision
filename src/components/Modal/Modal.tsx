import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";

// REDUX
import { RootState } from "../../redux";
import { BlockType } from "../../redux/types";

// COMPONENTS
import Button from "../Button";
import ModalContent from "./ModalContent";

// STYLES
import globalStyles from "../../common/globalStyles";

type ModalProps = {
  show: boolean;
  content: string;
  closeModal: () => void;
  handleClose?: () => void;
  handleSave?: () => void;
  textSave?: null | string;
  textCancel?: null | string;
};

type Dictionary = {
  [key: string]: string;
};

export default function MyModal({
  show,
  content,
  closeModal,
  handleClose,
  handleSave,
  textSave,
  textCancel,
}: ModalProps) {
  const { blocks, activeBlock } = useSelector(
    (state: RootState) => state.blocks
  );
  const [block, setBlock] = useState<BlockType | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!activeBlock?.id) return;
    if (blocks.filter((b) => b._id === activeBlock?.id).length === 0) return;
    setBlock(() => blocks.filter((b) => b._id === activeBlock?.id)[0]);
  }, [blocks, activeBlock]);

  const titles: Dictionary = {
    matrix: t("results:matrix"),
    weights: t("results:weights"),
    method: t("results:method"),
    connection: t("results:connection"),
  };

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Modal.Header
        closeButton
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        <Modal.Title className="w-100 text-center">
          {titles[content] ? titles[content] : null}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        <ModalContent content={content} data={block} />
      </Modal.Body>
      {handleClose || handleSave ? (
        <Modal.Footer
          className="d-flex gap-2"
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          {handleClose ? (
            <Button
              text={textCancel ? textCancel : t("common:cancel")}
              onClick={handleClose}
              style={globalStyles.buttonDanger}
            />
          ) : null}
          {handleSave ? (
            <Button
              text={textSave ? textSave : t("common:save")}
              onClick={handleSave}
              style={globalStyles.buttonSuccess}
            />
          ) : null}
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}
