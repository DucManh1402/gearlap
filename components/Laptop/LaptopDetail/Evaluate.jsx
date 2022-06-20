import React, { useState, useEffect } from "react";
import { Avatar, Form, Button, List, Input, Rate } from 'antd';
import moment from 'moment';
import apiService from "../../../utils/api/apiService";

const { TextArea } = Input;


export default function Evaluate({ feedbacks }) {
  const [tabStar, setTabStar] = useState(0);
  const [listDetail, setListDetail] = useState([]);
  const LIST_STAR = [5, 4, 3, 2, 1];
  const [loading, setLoading] = useState(false);

  const getDetailFeedbacks = async () => {
    try {
      setLoading(true)
      const product_id = feedbacks.data[0].product_id;
      const response = await apiService.get(`/feedbacks/star?star=${tabStar}&product_id=${product_id}`)
      setListDetail(response.data);
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (tabStar !== 0) {
      getDetailFeedbacks();
    }
  }, [tabStar])

  return (
    <div className="mx-20 mb-10">
      <div className="flex space-x-2 bg-yellow-100 px-4 py-3 mb-4">
        <Button onClick={() => setTabStar(0)} danger={tabStar === 0}>
          Tất cả
        </Button>
        {LIST_STAR.map(count => {
          const amount = feedbacks.amountStar[`count_${count}`];
          return <Button onClick={() => setTabStar(count)} danger={tabStar === count}>
            {count} sao {amount && <><span className="ml-1">({amount})</span></>}
          </Button>
        }
        )}
      </div>

      <List
        itemLayout="horizontal"
        dataSource={tabStar === 0 ? feedbacks.data : listDetail}
        loading={tabStar === 0 ? false : loading}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={<span>{moment(item.updated_at).format('DD-MM-YYYY HH:mm')} - {item.name}</span>}
              description={item.content}
            />
            <Rate disabled value={item.star} />
          </List.Item>
        )}
      />
    </div>

  );
}