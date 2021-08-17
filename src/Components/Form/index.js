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
import ReactWordcloud from "react-wordcloud";

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
  const [words, setWords] = useState([]);

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

  const fetchSentiments = async () => {
    setLoading(true);
    // const url =  `https://4rr0wv2.pythonanywhere.com/client?username=${formData.username.toLowerCase()}&start=${
    //   formData.start_date
    // }&end=${formData.end_date}`; // for production
    const url = `http://localhost:5000/client?username=${formData.username.toLowerCase()}&start=${
      formData.start_date
    }&end=${formData.end_date}`; // for dev on localhost
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    setLoading(false);
    return res.json();
  };

  const fetchWordcloudData = async () => {
    setLoading(true);
    // const url =  `https://4rr0wv2.pythonanywhere.com/client?username=${formData.username.toLowerCase()}&start=${
    //   formData.start_date
    // }&end=${formData.end_date}`; // for production
    const url = `http://localhost:5000/wordcloud?username=${formData.username.toLowerCase()}&start=${
      formData.start_date
    }&end=${formData.end_date}`; // for dev on localhost
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    setLoading(false);
    return res.json();
  };

  const call_apis = () => {
    fetchSentiments().then((data) => {
      setSentiments(data);
      setShow(true);
    });
    fetchWordcloudData().then((data) => {
      const keys = Object.keys(data);

      const list = [];
      keys.map((key) => list.push({ text: key, value: data[key] }));

      setWords(list);
      setShow(true);
    });
  };

  const validate = () => {
    if (error.length > 0) {
      setValid(false);
    } else {
      setValid(true);
      call_apis();
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
          <ReactWordcloud
            words={words}
            style={{ background: "white", height: "200px", width: "300px" }}
          />
        </div>
      )}
    </div>
  );
};
