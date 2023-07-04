import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";

// SLICES
import { queryChange } from "../../../../redux/slices/searchSlice";

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const { query } = useSelector((state: RootState) => state.search);
  const { t } = useTranslation();

  return (
    <div>
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder={`${t("common:search-placeholder")}`}
          aria-label="Search"
          value={query}
          onChange={(e) => dispatch(queryChange(e.target.value))}
        />
      </Form>
    </div>
  );
}
