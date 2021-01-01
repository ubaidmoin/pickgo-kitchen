import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Ripple from '../Components/Ripple';
import {useStateValue} from '../Services/State/State';
import {actions} from '../Services/State/Reducer';
import {getTables} from '../Services/API/APIManager';

const Tables = ({navigation}) => {
  useEffect(() => {
    fetchTables();
    return navigation.addListener('focus', () => fetchTables());
  }, []);

  const [{tables = []}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    try {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: true,
      });
      setLoading(true);
      const result = await getTables();
      if (result.data) {
        const {models = []} = result.data || {};
        if (models && models.length > 0) {
          dispatch({
            type: actions.SET_TABLES,
            tables: models,
          });
        } else {
          dispatch({
            type: actions.SET_TABLES,
            tables: [],
          });
        }
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ALERT_SETTINGS,
        alertSettings: {
          show: true,
          type: 'error',
          title: 'Error Occured',
          message:
            'This Operation Could Not Be Completed. Please Try Again Later.',
          showConfirmButton: true,
          confirmText: 'Ok',
        },
      });
    } finally {
      dispatch({
        type: actions.SET_PROGRESS_SETTINGS,
        show: false,
      });
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FlatList
        style={{flex: 1, paddingTop: '3%'}}
        showsVerticalScrollIndicator={false}
        data={tables}
        renderItem={({item}) => (
          <Ripple
            onPress={() => navigation.navigate('TableCart', {tableId: item.id})}
            key={item.id}
            style={{
              ...styles.item,
              backgroundColor: item.has_order
                ? item.activeOrder && item.activeOrder.tbl_no
                  ? '#fe0000'
                  : '#2b78e4'
                : '#27ae61',
            }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
          </Ripple>
        )}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTables} />
        }
      />
    </View>
  );
};

export default Tables;

const styles = StyleSheet.create({
  item: {
    width: Dimensions.get('screen').width * 0.44,
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: {
      height: 5,
      width: 2,
    },
    elevation: 5,
    padding: '10%',
    margin: '2%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});
