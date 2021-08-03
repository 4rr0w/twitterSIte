import { JsonForms } from "@jsonforms/react";
import React, { useEffect, useState } from "react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { schema, uischema } from "./data";
import styles from "./style.module.css";
import { Fade } from "react-reveal";
import { Button, Typography, Divider } from "antd";
import ReactApexCharts from "react-apexcharts";

export const Form = () => {
  const [formData, setFormData] = useState();
  const [error, setError] = useState([]);
  const [valid, setValid] = useState(true);
  const [sentiments, setSentiments] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState({
    labels: [],
    chart: {
      type: "donut",
    },
  });

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      ...Object.keys(sentiments).map((key) => {
        return sentiments[key];
      }),
    ]);

    const labels = [
      ...Object.keys(sentiments).map((key) => {
        return key.replace("_", " ");
      }),
    ];
    setOptions({ ...options, labels: labels });
  }, [sentiments]);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch(
      `https://4rr0wv2.pythonanywhere.com/client?username=${formData.username.toLowerCase()}&start=${
        formData.start_date
      }&end=${formData.end_date}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    setLoading(false);
    return res.json();
  };

  const call_api = () => {
    fetchData().then((data) => {
      setSentiments(data);
      setShow(true);
    });
  };

  const validate = () => {
    if (error.length > 0) {
      setValid(false);
    } else {
      setValid(true);
      call_api();
    }
  };

  return (
    <div className={styles.container}>
      <Fade>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={formData}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            setFormData(data);
            setError(errors);
          }}
        />
      </Fade>
      {!valid ? (
        <Typography.Text type="danger">
          Please fill all required fileds properly
        </Typography.Text>
      ) : (
        ""
      )}
      <br />
      <Button
        type="primary"
        onClick={() => {
          validate();
        }}
        loading={loading}
      >
        Submit
      </Button>
      {show && (
        <div className={styles.sentimentsChart}>
          <Divider> Sentiments </Divider>

          <ReactApexCharts
            options={options}
            series={series}
            type="donut"
            width="100%"
          />
        </div>
      )}
    </div>
  );
};
