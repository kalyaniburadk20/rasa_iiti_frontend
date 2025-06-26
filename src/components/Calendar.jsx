import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Modal,
  Button,
  Input,
  DatePicker,
  notification,
  Layout,
  Card,
  List,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "./calendar.css"; // Create this file for custom styling

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDateTime, setNewDateTime] = useState(null);
  const [notified, setNotified] = useState(new Set());

  const handleAdd = () => {
    if (newTitle && newDateTime) {
      const id = Date.now().toString();
      setEvents([
        ...events,
        {
          title: newTitle,
          date: dayjs(newDateTime).format(),
          id,
        },
      ]);
      setNewTitle("");
      setNewDateTime(null);
      setIsModalOpen(false);
    }
  };

  const handleDelete = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setNotified((prev) => {
      const updated = new Set(prev);
      updated.delete(eventId);
      return updated;
    });
  };

  const renderEventContent = (eventInfo) => (
    <div>
      <b>{eventInfo.timeText}</b> - {eventInfo.event.title}
      <Button
        type="link"
        size="small"
        danger
        onClick={() => handleDelete(eventInfo.event.id)}
      >
        Delete
      </Button>
    </div>
  );

  const openNotification = (title, dateTime) => {
    notification.open({
      message: "⏰ Reminder Alert!",
      description: `${title} is happening now at ${dayjs(dateTime).format("HH:mm")}`,
      placement: "topRight",
    });
  };

  useEffect(() => {
    // Ask for browser notification permission once
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  
    const interval = setInterval(() => {
      const now = dayjs();
  
      events.forEach((event) => {
        const eventTime = dayjs(event.date);
  
        // Check if it's time or just a few seconds past, but still not notified
        if (eventTime.isBefore(now.add(1, 'minute')) && eventTime.isAfter(now.subtract(1, 'minute')) && !notified.has(event.id)) {
          openNotification(event.title, event.date);
          if (Notification.permission === "granted") {
            new Notification("⏰ Reminder Alert!", {
              body: `${event.title} at ${dayjs(event.date).format("HH:mm")}`,
            });
          }
          setNotified((prev) => new Set(prev).add(event.id));
        }
      });
    }, 15000); // Check every 15 seconds for more precision
  
    return () => clearInterval(interval);
  }, [events, notified]);
  

  const upcomingReminders = events
    .filter((event) => {
      const now = dayjs();
      const eventTime = dayjs(event.date);
      return eventTime.isAfter(now) && eventTime.diff(now, "hour") <= 1;
    })
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529", padding: "0 20px" }}>
        <Title style={{ color: "#fff", lineHeight: "64px", margin: 0 }} level={3}>
          🗓️ Your Reminder Calendar
        </Title>
      </Header>
      <Layout>
        <Content style={{ padding: "24px", background: "#f0f2f5" }}>
          <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 20 }}>
            Add Reminder
          </Button>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={renderEventContent}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="auto"
            nowIndicator={true}
          />
        </Content>

        <Sider width={300} theme="light" style={{ padding: "24px" }}>
          <Title level={4}>🔔 Upcoming Reminders</Title>
          <List
            dataSource={upcomingReminders}
            locale={{ emptyText: "No upcoming reminders in the next hour." }}
            renderItem={(item) => (
              <Card size="small" style={{ marginBottom: 10 }}>
                <Text strong>{item.title}</Text>
                <br />
                <Text type="secondary">{dayjs(item.date).format("ddd, MMM D • HH:mm")}</Text>
              </Card>
            )}
          />
        </Sider>
      </Layout>

      <Modal
        title="Add Reminder"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
        okText="Add"
      >
        <Input
          placeholder="Reminder title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <DatePicker
          showTime
          style={{ width: "100%" }}
          value={newDateTime}
          onChange={(date) => setNewDateTime(date)}
        />
      </Modal>
    </Layout>
  );
};

export default Calendar;
