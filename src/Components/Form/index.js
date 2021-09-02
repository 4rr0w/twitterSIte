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
  const [total, setTotal] = useState(0);
  const [total2020, setTotal2020] = useState(0);
  const [error, setError] = useState([]);
  const [valid, setValid] = useState(true);
  const [sentiments2020, setSentiments2020] = useState({});
  const [sentiments, setSentiments] = useState({});
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState({
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {},
            value: {},
          },
        },
      },
    },
    labels: [],
    chart: {
      type: "donut",
    },
  });
  const [options2020, setOptions2020] = useState({
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {},
            value: {},
          },
        },
      },
    },
    labels: [],
    chart: {
      type: "donut",
    },
  });

  const [series, setSeries] = useState([]);
  const [series2020, setSeries2020] = useState([]);
  const [words, setWords] = useState([]);
  const [words2020, setWords2020] = useState([]);

  const wordoptions = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [10, 60],
  };

  useEffect(() => {
    setSeries([
      ...Object.keys(sentiments).map((key) => {
        return sentiments[key];
      }),
    ]);
    let t = 0;
    Object.keys(sentiments).map((key) => {
      t += sentiments[key];
    });

    setTotal(t);
    const labels = [
      ...Object.keys(sentiments).map((key) => {
        return key.replace("_", " ");
      }),
    ];
    setOptions({ ...options, labels: labels });
  }, [sentiments]);

  useEffect(() => {
    setSeries2020([
      ...Object.keys(sentiments2020).map((key) => {
        return sentiments2020[key];
      }),
    ]);
    let t = 0;
    Object.keys(sentiments2020).map((key) => {
      t += sentiments2020[key];
    });

    setTotal2020(t);
    const labels2020 = [
      ...Object.keys(sentiments2020).map((key) => {
        return key.replace("_", " ");
      }),
    ];
    setOptions2020({ ...options, labels: labels2020 });
  }, [sentiments2020]);

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
      setSentiments(data["2021"]);
      setSentiments2020(data["2020"]);
      setShow(true);
    });
    fetchWordcloudData().then((data) => {
      console.log(data["2021"]);

      const keys = Object.keys(data["2021"]);
      const list = [];
      keys.map((key) => list.push({ text: key, value: data["2021"][key] }));
      setWords(list);
      console.log(list);

      const keys2020 = Object.keys(data["2020"]);
      const list2020 = [];
      keys2020.map((key) =>
        list2020.push({ text: key, value: data["2020"][key] })
      );
      setWords2020(list2020);

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
    <div className={styles.main}>
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
            <Divider> Sentiments 2021 </Divider>
            <p>Total: {total}</p>
            <ReactApexCharts
              options={options}
              series={series}
              type="donut"
              width="100%"
            />
            <Divider> Sentiments 2020 </Divider>
            <p>Total: {total2020}</p>
            <ReactApexCharts
              options={options2020}
              series={series2020}
              type="donut"
              width="100%"
            />
            <Divider> Wordcloud 2021</Divider>
            <ReactWordcloud
              words={words}
              style={{ background: "white", maxHeight: "250px" }}
              options={wordoptions}
            />
            <Divider> Wordcloud 2020</Divider>
            <ReactWordcloud
              words={words2020}
              style={{ background: "white", maxHeight: "250px" }}
              options={wordoptions}
            />
          </div>
        )}
      </div>
    </div>
  );
};
