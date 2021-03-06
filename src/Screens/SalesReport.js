import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  PixelRatio,
} from 'react-native';
import Switcher from '../Components/Switcher';
import Ripple from '../Components/Ripple';
import CheckBox from '../Components/CheckBox';
import {getNotificationCount} from '../Services/DataManager';
import {getReservations} from '../Services/API/APIManager';
import Languages from '../Localization/translations';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {formatCurrency} from '../Services/Common';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const scale = SCREEN_WIDTH / 320;

const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const SalesReport = ({navigation}) => {
  const [{reservations, selectedLanguage}, dispatch] = useStateValue();
  const [report, setReport] = useState(null);
  const [selected, setSelected] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchReservations();
    return navigation.addListener('focus', () => fetchReservations());
  }, []);

  useEffect(() => {
    calculate();
  }, [reservations]);

  const fetchReservations = async () => {
    getNotificationCount().then((notificationCount) =>
      navigation.setParams({notificationCount}),
    );
    try {
      if (!(reservations && reservations.length > 0)) {
        dispatch({
          type: actions.SET_PROGRESS_SETTINGS,
          show: true,
        });
      }
      const result = await getReservations();
      if (result.data) {
        const {order = []} = result.data || {};
        if (order && order.length > 0) {
          dispatch({
            type: actions.SET_RESERVATIONS,
            reservations: order,
          });
        } else {
          dispatch({
            type: actions.SET_RESERVATIONS,
            reservations: [],
          });
        }
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: Languages[selectedLanguage].messages.errorOccured,
          message: Languages[selectedLanguage].messages.tryAgainLater,
          showConfirmButton: true,
          confirmText: Languages[selectedLanguage].messages.ok,
        },
      });
    } finally {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
    }
  };

  const calculate = async (startDate, endDate) => {
    try {
      if (reservations && reservations.length > 0) {
        dispatch({
          type: actions.SET_PROGRESS_SETTINGS,
          show: true,
        });
        let filteredReservations = null;
        if (startDate && endDate) {
          filteredReservations = reservations.filter(
            (r) =>
              moment(moment(r.date_created).format('YYYY-MM-DD')).isSameOrAfter(
                moment(startDate).format('YYYY-MM-DD'),
              ) &&
              moment(
                moment(r.date_created).format('YYYY-MM-DD'),
              ).isSameOrBefore(moment(endDate).format('YYYY-MM-DD')),
          );
        } else {
          filteredReservations = reservations.filter((r) =>
            moment(moment(r.date_created).format('YYYY-MM-DD')).isSame(
              moment().format('YYYY-MM-DD'),
            ),
          );
        }
        const report =
          filteredReservations && filteredReservations.length > 0
            ? filteredReservations.reduce((a, b) => {
                return {
                  subtotal: parseFloat(a.subtotal) + parseFloat(b.subtotal),
                  tax: parseFloat(a.tax) + parseFloat(b.tax),
                  tips: parseFloat(a.tips) + parseFloat(b.tips),
                  discount: parseFloat(a.discount) + parseFloat(b.discount),
                };
              })
            : null;
        setReport(report);
      }
    } catch (error) {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
    } finally {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
    }
  };

  const onSelect = (val) => {
    setSelected(val);
    if (val === 0) {
      calculate();
    } else {
      calculate(startDate, endDate);
    }
  };

  const onStartDateChange = (date) => {
    if (date) {
      setStartDate(date);
      calculate(date, endDate);
    }
  };

  const onEndDateChange = (date) => {
    if (date) {
      setEndDate(date);
      calculate(startDate, date);
    }
  };

  const {
    card = 0,
    cash = 0,
    onePay = 0,
    tax = 0,
    tips = 0,
    discount = 0,
    fees = 0,
    availableBalance = 0,
    deposited = 0,
    subtotal = 0,
  } = report || {};

  return (
    <View style={{flex: 1, marginHorizontal: '3%', marginVertical: '2%'}}>
      <Switcher
        options={[
          {title: Languages[selectedLanguage].salesReport.todaySale},
          {title: Languages[selectedLanguage].salesReport.all},
        ]}
        selected={selected}
        onChange={onSelect}
      />
      <View style={{marginVertical: 2}}>
        <CheckBox
          size={20}
          title={`${Languages[selectedLanguage].salesReport.showDetails}?`}
          isChecked={showDetails}
          onChange={() => setShowDetails(!showDetails)}
        />
      </View>
      {selected === 1 ? (
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              ...styles.box,
              paddingVertical: '2%',
              paddingHorizontal: '1%',
            }}>
            <DatePicker
              date={startDate}
              format="MMM DD, YYYY"
              maxDate={new Date()}
              placeholder="Start Date"
              showIcon={false}
              TouchableComponent={Ripple}
              customStyles={{
                placeholderText: {color: '#000'},
                dateInput: {borderWidth: 0},
                dateText: {fontSize: normalize(14)},
              }}
              onDateChange={onStartDateChange}
            />
            <Text style={{position: 'absolute', top: '-2.5%', left: '3%'}}>
              {Languages[selectedLanguage].salesReport.from}
            </Text>
          </View>
          <FontAwesomeIcon
            name="arrow-right"
            color="#000"
            size={20}
            style={{marginHorizontal: '3%'}}
          />
          <View
            style={{
              ...styles.box,
              paddingVertical: '2%',
              paddingHorizontal: '1%',
            }}>
            <DatePicker
              date={endDate}
              format="MMM DD, YYYY"
              maxDate={new Date()}
              placeholder="Start Date"
              showIcon={false}
              TouchableComponent={Ripple}
              customStyles={{
                placeholderText: {color: '#000'},
                dateInput: {borderWidth: 0},
                dateText: {fontSize: normalize(14)},
              }}
              onDateChange={onEndDateChange}
            />
            <Text style={{position: 'absolute', top: '-2.5%', left: '3%'}}>
              {Languages[selectedLanguage].salesReport.to}
            </Text>
          </View>
        </View>
      ) : null}
      {showDetails ? (
        <View style={styles.box}>
          <Text>
            {Languages[selectedLanguage].salesReport.orderItemDetails}
          </Text>
        </View>
      ) : null}
      <View style={styles.box}>
        <View style={{marginBottom: 10}}>
          <Text style={styles.rowText}>
            {`${Languages[selectedLanguage].salesReport.payment}:`}
          </Text>
          <View
            style={{
              marginLeft: '5%',
              ...styles.row,
            }}>
            <Text style={styles.rowText}>
              {`${Languages[selectedLanguage].salesReport.card}:`}
            </Text>
            <Text style={styles.rowText}>
              {formatCurrency(card, false, true)}
            </Text>
          </View>
          <View
            style={{
              marginLeft: '5%',
              ...styles.row,
            }}>
            <Text style={styles.rowText}>
              {`${Languages[selectedLanguage].salesReport.Cash}:`}
            </Text>
            <Text style={styles.rowText}>
              {formatCurrency(cash, false, true)}
            </Text>
          </View>
          <View
            style={{
              marginLeft: '5%',
              ...styles.row,
            }}>
            <Text style={styles.rowText}>
              {`${Languages[selectedLanguage].salesReport.onePay}:`}
            </Text>
            <Text style={styles.rowText}>
              {formatCurrency(onePay, false, true)}
            </Text>
          </View>
        </View>
        <View style={{marginBottom: 10}}>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {`${Languages[selectedLanguage].salesReport.tax}:`}
            </Text>
            <Text style={styles.rowText}>
              {formatCurrency(tax, false, true)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {`${Languages[selectedLanguage].salesReport.tips}:`}
            </Text>
            <Text style={styles.rowText}>
              {formatCurrency(tips, false, true)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {`${Languages[selectedLanguage].salesReport.discount}:`}
            </Text>
            <Text style={styles.rowText}>
              {formatCurrency(discount, false, true)}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>
            {`${Languages[selectedLanguage].salesReport.fees}:`}
          </Text>
          <Text style={styles.rowText}>
            {formatCurrency(fees, false, true)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>
            {`${Languages[selectedLanguage].salesReport.availableBalance}:`}
          </Text>
          <Text style={styles.rowText}>
            {formatCurrency(availableBalance, false, true)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>
            {`${Languages[selectedLanguage].salesReport.deposited}:`}
          </Text>
          <Text style={styles.rowText}>
            {formatCurrency(deposited, false, true)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>
            {`${Languages[selectedLanguage].salesReport.subtotal}:`}
          </Text>
          <Text style={styles.rowText}>
            {formatCurrency(subtotal, false, true)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SalesReport;

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: '3%',
    fontSize: normalize(14),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: normalize(12),
    color: '#000',
  },
  divider: {
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: '#767676',
  },
  box: {
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
    padding: 10,
    borderRadius: 5,
    paddingVertical: '5%',
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    marginVertical: '2%',
  },
});
