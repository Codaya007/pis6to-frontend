"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_BASEURL } from '@/constants';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ sender: 'bot', text: 'Hola! Puedo proporcionarte información sobre humedad, temperatura, niveles de CO2 y resúmenes del ambiente. ¿Qué te gustaría saber?' }]);
        }
    }, [messages]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSendMessage = async () => {
        if (input.trim() === '') return;
        const userMessage = { sender: 'user', text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        const response = await getResponse(input);
        const botMessage = { sender: 'bot', text: response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setInput('');
    };

    const getResponse = async (query) => {
        query = query.toLowerCase();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (query.includes('integrantes del pis')) {
            return 'El PIS está integrado por Jhair Agila, Jhonel Pesantes, Viviana Calva y Alexander Cañar.';
        }

        if (query.includes('es humedad')) {
            return 'La humedad se refiere a la cantidad de vapor de agua presente en el aire. Se mide en porcentaje y es importante para determinar el confort y la salud ambiental.';
        }

        if (query.includes('es temperatura')) {
            return 'La temperatura es una medida de la cantidad de calor en el ambiente, y se mide en grados Celsius (°C). Afecta el confort y el funcionamiento de diversos equipos y procesos.';
        }

        if (query.includes('es el co2')) {
            return 'El CO2 (dióxido de carbono) es un gas incoloro e inodoro que se produce por la respiración y la combustión. Niveles elevados de CO2 pueden indicar una mala ventilación.';
        }

        if (query.includes('objetivo del proyecto')) {
            return 'El objetivo del proyecto es monitorear las condiciones ambientales del aula magna, incluyendo la humedad, la temperatura y los niveles de CO2, para asegurar un ambiente saludable y confortable para los usuarios.';
        }

        const dateMatch = query.match(/el (\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            const date = dateMatch[1];
            if (query.includes('humedad')) {
                return await getAverageData(date, 'hum');
            } else if (query.includes('temperatura')) {
                return await getAverageData(date, 'temp');
            } else if (query.includes('co2') || query.includes('nivel de co2')) {
                return await getCO2Level(date);
            } else if (query.includes('clima') || query.includes('ambiente') || query.includes('resumen')) {
                return await getClimateOverview(date);
            }
        }

        if (query.includes('hola') || query.includes('ayuda')) {
            return 'Puedo proporcionarte información sobre humedad, temperatura, niveles de CO2 y resúmenes del ambiente. Puedes preguntar por días específicos o datos generales.';
        }

        if (query.includes('temperatura')) {
            if (query.includes('hoy')) {
                return await getAverageData(today, 'temp');
            } else if (query.includes('ayer')) {
                return await getAverageData(yesterday, 'temp');
            } else {
                return await getGeneralData('temp');
            }
        }

        if (query.includes('humedad')) {
            if (query.includes('hoy')) {
                return await getAverageData(today, 'hum');
            } else if (query.includes('ayer')) {
                return await getAverageData(yesterday, 'hum');
            } else {
                return await getGeneralData('hum');
            }
        }

        if (query.includes('co2') || query.includes('nivel de co2')) {
            if (query.includes('hoy')) {
                return await getCO2Level(today);
            } else if (query.includes('ayer')) {
                return await getCO2Level(yesterday);
            } else {
                return await getGeneralData('co2');
            }
        }

        if (query.includes('clima') || query.includes('ambiente') || query.includes('resumen')) {
            if (query.includes('hoy')) {
                return await getClimateOverview(today);
            } else if (query.includes('ayer')) {
                return await getClimateOverview(yesterday);
            } else {
                return await getGeneralClimateOverview();
            }
        }

        return 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla? Puedo proporcionar información sobre temperatura, humedad, CO2 y resúmenes del ambiente.';
    };

    const getClimateData = async (date) => {
        try {
            const response = await fetch(`${BACKEND_BASEURL}/ms3/climate-datas?skip=0&limit=10&toDate=${date}&populate=true`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    const getAverageData = async (date, dataType) => {
        try {
            const data = await getClimateData(date);

            if (data && data.length > 0) {
                const sum = data.reduce((acc, curr) => acc + curr[dataType], 0);
                const average = sum / data.length;
                const unit = dataType === 'temp' ? '°C' : '%';
                return `El promedio de ${dataType === 'temp' ? 'temperatura' : 'humedad'} para ${date} fue ${average.toFixed(2)}${unit} y es ${average < 20 ? 'bajo' : average < 30 ? 'aceptable' : 'alto'}.`;
            } else {
                return `No hay datos disponibles para ${date}.`;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return 'Lo siento, hubo un error al obtener los datos.';
        }
    };

    const getGeneralData = async (dataType) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const data = await getClimateData(today);

            if (data && data.length > 0) {
                const sum = data.reduce((acc, curr) => acc + curr[dataType], 0);
                const average = sum / data.length;
                const unit = dataType === 'temp' ? '°C' : dataType === 'hum' ? '%' : 'ppm';
                const typeString = dataType === 'temp' ? 'temperatura' : dataType === 'hum' ? 'humedad' : 'CO2';
                return `El promedio general de ${typeString} es ${average.toFixed(2)}${unit}.`;
            } else {
                return `No hay datos disponibles.`;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return 'Lo siento, hubo un error al obtener los datos.';
        }
    };

    const getCO2Level = async (date) => {
        try {
            const data = await getClimateData(date);

            if (data && data.length > 0) {
                const latestCO2 = data[0].co2;
                let evaluation = '';
                if (latestCO2 < 1000) {
                    evaluation = 'bueno, por debajo del límite recomendado.';
                } else if (latestCO2 < 2000) {
                    evaluation = 'aceptable, pero se recomienda mejorar la ventilación.';
                } else {
                    evaluation = 'malo, se recomienda mejorar la ventilación y reducir las fuentes de emisión.';
                }
                return `El nivel más reciente de CO2 es ${latestCO2.toFixed(2)} ppm, lo cual es considerado ${evaluation}.`;
            } else {
                return `No hay datos de CO2 disponibles para ${date}.`;
            }
        } catch (error) {
            console.error('Error fetching CO2 data:', error);
            return 'Lo siento, hubo un error al obtener los datos de CO2.';
        }
    };

    const getClimateOverview = async (date) => {
        try {
            const data = await getClimateData(date);

            if (data && data.length > 0) {
                const tempAvg = data.reduce((acc, curr) => acc + curr.temp, 0) / data.length;
                const humAvg = data.reduce((acc, curr) => acc + curr.hum, 0) / data.length;
                const co2Avg = data.reduce((acc, curr) => acc + curr.co2, 0) / data.length;

                const tempEvaluation = evaluateTemperature(tempAvg);
                const humEvaluation = evaluateHumidity(humAvg);
                const co2Evaluation = evaluateCO2(co2Avg);

                return `Resumen del ambiente para ${date}:
        Temperatura promedio: ${tempAvg.toFixed(2)}°C (${tempEvaluation}).
        Humedad promedio: ${humAvg.toFixed(2)}% (${humEvaluation}).
        Nivel de CO2 promedio: ${co2Avg.toFixed(2)} ppm (${co2Evaluation})`;
            } else {
                return `No hay datos disponibles para ${date}.`;
            }
        } catch (error) {
            console.error('Error fetching climate data:', error);
            return 'Lo siento, hubo un error al obtener los datos del ambiente.';
        }
    };

    const evaluateTemperature = (temp) => {
        if (temp < 10) return 'malo, muy frío';
        if (temp >= 10 && temp <= 15) return 'aceptable, fresco';
        if (temp > 15 && temp < 25) return 'bueno y agradable';
        if (temp >= 25 && temp <= 30) return 'aceptable, un poco cálido';
        return 'malo, muy caliente';
    };

    const evaluateHumidity = (hum) => {
        if (hum < 30) return 'malo, un poco seco, posibles problemas de sequedad';
        if (hum >= 30 && hum < 40) return 'aceptable, seco';
        if (hum >= 40 && hum <= 60) return 'bueno, agradable, nivel óptimo';
        if (hum > 60 && hum <= 70) return 'aceptable, un poco húmedo ';
        return 'malo, muy húmedo, posibles problemas de moho';
    };

    const evaluateCO2 = (co2) => {
        if (co2 < 1000) return 'bueno, por debajo del límite recomendado, buena ventilación';
        if (co2 >= 1000 && co2 < 2000) return 'aceptable, se recomienda mejorar la ventilación, límite recomendado';
        return 'malo, se recomienda mejorar la ventilación y reducir las fuentes de emisión para mantener un ambiente saludable';
    };

    const getGeneralClimateOverview = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const data = await getClimateData(today);

            if (data && data.length > 0) {
                const tempAvg = data.reduce((acc, curr) => acc + curr.temp, 0) / data.length;
                const humAvg = data.reduce((acc, curr) => acc + curr.hum, 0) / data.length;
                const co2Avg = data.reduce((acc, curr) => acc + curr.co2, 0) / data.length;

                return `Resumen general del ambiente:
        Temperatura promedio: ${tempAvg.toFixed(2)}°C, se considera ${evaluateTemperature(tempAvg)}.
        Humedad promedio: ${humAvg.toFixed(2)}% , se considera ${evaluateHumidity(humAvg)}.
        Nivel de CO2 promedio: ${co2Avg.toFixed(2)} ppm, se considera ${evaluateCO2(co2Avg)}.`;
            } else {
                return `No hay datos disponibles.`;
            }
        } catch (error) {
            console.error('Error fetching general climate data:', error);
            return 'Lo siento, hubo un error al obtener los datos generales del ambiente.';
        }
    };

    return (
        <div style={styles.chatbot}>
            <h1>Chat Bot de Monitoreo ambiental</h1>
            <div style={styles.chatWindow}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            ...(message.sender === 'user' ? styles.userMessage : styles.botMessage),
                        }}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Pregunta sobre promedios de humedad, temperatura o niveles de CO2..."
                    style={styles.input}
                />
                <button onClick={handleSendMessage} style={styles.button}>
                    Enviar
                </button>
            </div>
        </div>
    );
};

const styles = {
    chatbot: {
        width: '400px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    chatWindow: {
        height: '400px',
        border: '1px solid #ccc',
        padding: '10px',
        overflowY: 'scroll',
    },
    message: {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
    },
    userMessage: {
        backgroundColor: '#e1ffc7',
        alignSelf: 'flex-end',
        textAlign: 'right',
    },
    botMessage: {
        backgroundColor: '#f1f1f1',
        alignSelf: 'flex-start',
    },
    inputArea: {
        display: 'flex',
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px 0 0 5px',
    },
    button: {
        padding: '10px',
        border: '1px solid #ccc',
        borderLeft: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '0 5px 5px 0',
        cursor: 'pointer',
    },
};

export default Chatbot;
