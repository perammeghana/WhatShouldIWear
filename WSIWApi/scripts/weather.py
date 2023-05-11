import json
import math
import requests
import sys
import pymysql
from datetime import datetime
import pytz
# import MySQLdb
import pandas as pd
from datetime import datetime
from bs4 import BeautifulSoup
from requests.structures import CaseInsensitiveDict
# import pymysql
# pymysql.install_as_MySQLdb()

allOrSingle = sys.argv[1]
weeklyOrHourly = sys.argv[2]
locationid = sys.argv[3]
# get the current time in UTC
now_utc = datetime.utcnow()

# convert UTC time to Eastern Standard Time
eastern_tz = pytz.timezone('US/Eastern')
now_est = eastern_tz.localize(now_utc)
# format the current time in EST as mm-dd-yyyy hh:mm:ss
now_est_formatted = now_est.strftime('%Y-%m-%d %H:%M:%S')

url1 = "https://api.geoapify.com/v1/geocode/reverse?lat={}&lon={}&apiKey=a217f724a0e542a3a0639a40ac736688"

h = CaseInsensitiveDict()
h["Accept"] = "application/json"

resp = requests.get(url1, headers=h)
url2days = "https://forecast.weather.gov/MapClick.php?w0=t&w1=td&w2=wc&w3=sfcwind&w3u=1&w4=sky&w5=pop&w6=rh&w7=rain&w8=thunder&w9=snow&w10=fzg&w11=sleet&w13u=0&w16u=1&w17u=1&AheadHour=0&Submit=Submit&FcstType=digital&textField1={}&textField2={}&site=all&unit=0&dd=&bw="
url4days = "https://forecast.weather.gov/MapClick.php?w0=t&w1=td&w2=wc&w3=sfcwind&w3u=1&w4=sky&w5=pop&w6=rh&w7=rain&w8=thunder&w9=snow&w10=fzg&w11=sleet&w13u=0&w16u=1&w17u=1&AheadHour=48&Submit=Submit&FcstType=digital&textField1={}&textField2={}&site=all&unit=0&dd=&bw="
url7days = "https://forecast.weather.gov/MapClick.php?w0=t&w1=td&w2=wc&w3=sfcwind&w3u=1&w4=sky&w5=pop&w6=rh&w7=rain&w8=thunder&w9=snow&w10=fzg&w11=sleet&w13u=0&w16u=1&w17u=1&AheadHour=96&Submit=Submit&FcstType=digital&textField1={}&textField2={}&site=all&unit=0&dd=&bw="
# url2days = "https://forecast.weather.gov/MapClick.php?lat={}&lon={}&unit=0&lg=english&FcstType=digital"
# url4days = "https://forecast.weather.gov/MapClick.php?lat={}&lon={}&unit=0&lg=english&FcstType=digital&AheadHour=48"
# url7days = "https://forecast.weather.gov/MapClick.php?lat={}&lon={}&unit=0&lg=english&FcstType=digital&AheadHour=96"


DEBUG_GET = 0
DEBUG_CALC = 0
lastValue = ''
db_Hour = [""]*25
db_Temperature = [""]*25
db_Dewpoint = [""]*25
db_HeatIndex = [""]*25
db_WindChill = [""]*25
db_SurfaceWind = [""]*25
db_WindDir = [""]*25
db_Gust = [""]*25
db_SkyCover = [""]*25
db_PrecipitationPotential = [""]*25
db_RelativeHumidity = [""]*25
db_Rain = [""]*25
db_Thunder = [""]*25
db_Forecast = [""]*25
db_Alert = [""]*25
db_Snow = [""]*25
db_FreezingRain = [""]*25
db_Sleet = [""]*25
db_ApparentTemp = [""]*25
db_ShadeTemp = [""]*25
db_OutsideSedentary = [""]*25
db_OutsideMoving = [""]*25
db_RunEasy = [""]*25
db_RunHard = [""]*25
db_BikeEasy = [""]*25
db_BikeHard = [""]*25
db_SunTimeFraction = [0]*25
db_SunCloudFraction = [0]*25
db_date = [""]*25
db_timezone = [""]*25


def estimateSunTimes():

    global SunRiseTime
    global SunSetTime
    global SunAltFraction

    currentMonth = datetime.now().month

    if (currentMonth == 1):
        SunSetTime = 17
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(26.2))
    if (currentMonth == 2):
        SunSetTime = 18
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(34.7))
    if (currentMonth == 3):
        SunSetTime = 19
        SunRiseTime = 7
        SunAltFraction = math.sin(math.radians(45.3))
    if (currentMonth == 4):
        SunSetTime = 20
        SunRiseTime = 7
        SunAltFraction = math.sin(math.radians(57.1))
    if (currentMonth == 5):
        SunSetTime = 21
        SunRiseTime = 6
        SunAltFraction = math.sin(math.radians(66.2))
    if (currentMonth == 6):
        SunSetTime = 21
        SunRiseTime = 6
        SunAltFraction = math.sin(math.radians(70.5))
    if (currentMonth == 7):
        SunSetTime = 21
        SunRiseTime = 6
        SunAltFraction = math.sin(math.radians(68.5))
    if (currentMonth == 8):
        SunSetTime = 21
        SunRiseTime = 6
        SunAltFraction = math.sin(math.radians(60.9))
    if (currentMonth == 9):
        SunSetTime = 20
        SunRiseTime = 7
        SunAltFraction = math.sin(math.radians(49.9))
    if (currentMonth == 10):
        SunSetTime = 19
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(38.4))
    if (currentMonth == 11):
        SunSetTime = 18
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(28.5))
    if (currentMonth == 12):
        SunSetTime = 17
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(23.8))


def getlocations(allOrsingle, location_id):
    db = pymysql.connect(host="localhost", user="root",
                         passwd="Dm122448@", db="what_should_i_wear")
    cursor = db.cursor()
    if (allOrsingle == 'all'):
        # execute SQL query using execute() method.
        sql = "SELECT * from location where isAvailable = 'Yes';"
    else:
        sql = "SELECT * from location where location_id = " + \
            str(location_id)+";"
    try:
        # Execute the SQL command
        cursor.execute(sql)
        locations = []
        IndLocations = []
        # Fetch all the rows in a list of lists.
        results = cursor.fetchall()
        for row in results:
            IndLocations = list()
            location_id = row[0]
            postal_code = row[1]
            latitude = row[4]
            longitude = row[5]
            city = row[2]
            IndLocations.append(postal_code)
            IndLocations.append(latitude)
            IndLocations.append(longitude)
            IndLocations.append(city)
            IndLocations.append(location_id)
            locations.append(IndLocations)
            # print(locations)
            # Now print fetched result
        return locations
    except:
        print("Error: unable to fetch data")

    # disconnect from server
    db.close()


df_locations = getlocations(allOrSingle, locationid)


def resetRowToGet(webpageRowNum):

    # Each NWS webpage has two "grids", each 24 hours of info. If we are looking at
    # the first row, the table row in BeautifulSoup is '0', if it's the second row,
    # then the day starts at '17'.
    if (webpageRowNum == 1):
        BSrowToGet = 0
        if (DEBUG_GET):
            print("<br>BSrowToGet: " + str(BSrowToGet))
        return BSrowToGet
    else:
        BSrowToGet = 17
        if (DEBUG_GET):
            print("<br>BSrowToGet: " + str(BSrowToGet))
        return BSrowToGet


def ifTextGetDataFor(tabular, rowToGet, textToGet, i, rowTitleIsBold):
    if (rowTitleIsBold):
        if (tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[0].font.b.get_text() == textToGet):
            return tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[i].font.b.get_text()
    elif (tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[0].font.get_text() == textToGet):
        if (tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[i].font.b.get_text() == '--'):
            return None
        else:
            return tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[i].font.b.get_text()
    else:
        return None


def ifTextGetDataForDate(tabular, rowToGet, textToGet, i, rowTitleIsBold):
    if (rowTitleIsBold):
        if ((tabular.find_all('table')[7].find_all('tr')[1+rowToGet].find_all('td')[0].font.b.get_text() == textToGet) and (tabular.find_all('table')[7].find_all('tr')[1+rowToGet].find_all('td')[i].font.b != None)):
            return tabular.find_all('table')[7].find_all('tr')[1+rowToGet].find_all('td')[i].font.b.get_text()
        else:
            return None


def calculateApparentTemp(i):

    db_ApparentTemp[i] = float(db_Temperature[i])
    if (DEBUG_CALC):
        print("<br>ApparentTemp #1: Start with air temp: " +
              str(db_ApparentTemp[i]))

    db_ShadeTemp[i] = db_Temperature[i]
    if (DEBUG_CALC):
        print("<br>ShadeTemp #1: Start with air temp: " + str(db_ShadeTemp[i]))

    if (db_HeatIndex[i] != None and int(db_HeatIndex[i]) >= 74):

        db_ApparentTemp[i] = db_HeatIndex[i]
        if (DEBUG_CALC):
            print("<br>ApparentTemp #2: HI is populated and >=74, use HI: " +
                  str(db_ApparentTemp[i]))

        db_ShadeTemp[i] = db_HeatIndex[i]
        if (DEBUG_CALC):
            print("<br>ShadeTemp #2: HI is populated and >=74, use HI: " +
                  str(db_ShadeTemp[i]))

    elif (db_WindChill[i] != None and int(db_WindChill[i]) <= 50):

        db_ApparentTemp[i] = db_WindChill[i]
        if (DEBUG_CALC):
            print("<br>ApparentTemp #2: WC is populated and <=50, use WC: " +
                  str(db_ApparentTemp[i]))

        db_ShadeTemp[i] = db_WindChill[i]
        if (DEBUG_CALC):
            print("<br>ShadeTemp #2: WC is populated and <=50, use WC: " +
                  str(db_ShadeTemp[i]))

    else:

        if (DEBUG_CALC):
            print("<br>ApparentTemp #2: No WC and no HI, no modifier: " +
                  str(db_ApparentTemp[i]))
            print("<br>ShadeTemp #2: No WC and no HI, no modifier: " +
                  str(db_ShadeTemp[i]))

    if (int(db_Dewpoint[i]) > 55):

        db_ApparentTemp[i] = int(db_ApparentTemp[i]) + \
            ((int(db_Dewpoint[i])-55)/2)
        if (DEBUG_CALC):
            print("<br>ApparentTemp #3: Dewpoint is >55, add 1 degree for each 2 above 55: " +
                  str(db_ApparentTemp[i]))

        db_ShadeTemp[i] = int(db_ShadeTemp[i]) + ((int(db_Dewpoint[i])-55)/2)
        if (DEBUG_CALC):
            print("<br>ShadeTemp #3: Dewpoint is >55, add 1 degree for each 2 above 55: " +
                  str(db_ShadeTemp[i]))

    else:

        if (DEBUG_CALC):
            print("<br>ApparentTemp #3: Dewpoint is <=55, no modifier: " +
                  str(db_ApparentTemp[i]))
            print("<br>ShadeTemp #3: Dewpoint is <=55, no modifier: " +
                  str(db_ShadeTemp[i]))

    if (int(db_Temperature[i]) > 50 and int(db_SurfaceWind[i]) > 5):

        db_ApparentTemp[i] = int(db_ApparentTemp[i]) - \
            ((int(db_SurfaceWind[i]) - 5)/3)
        if (DEBUG_CALC):
            print("<br>ApparentTemp #4: Above temp of 50, wind is >5. Subtract one degree for each 3 mph above 5: "
                  + str(db_ApparentTemp[i]))

    else:

        if (DEBUG_CALC):
            print("<br>ApparentTemp #4: Temp < 50 or wind <5. No modifier: "
                  + str(db_ApparentTemp[i]))

    if (int(db_Hour[i]) >= SunRiseTime and int(db_Hour[i]) < SunSetTime):

        db_ApparentTemp[i] = int(
            db_ApparentTemp[i]) + (15 * db_SunCloudFraction[i] * db_SunTimeFraction[i] * SunAltFraction)
        if (DEBUG_CALC):
            print("<br>ApparentTemp #5: It is daytime, add up to 15 degrees for sun strength based on clouds, time, and altitude: "
                  + str(db_ApparentTemp[i]))

    else:

        if (DEBUG_CALC):
            print("<br>ApparentTemp #5: Nighttime, no sun modifier: "
                  + str(db_ApparentTemp[i]))

    if (int(db_SkyCover[i]) > 70 and int(db_PrecipitationPotential[i]) > 50):

        db_ApparentTemp[i] = int(db_ApparentTemp[i]) - \
            ((int(db_PrecipitationPotential[i])-50)/10)
        if (DEBUG_CALC):
            print("<br>ApparentTemp #6: If mostly cloudy and POPs >50, then subtract 1 degree for every 10 POPs over 50: "
                  + str(db_ApparentTemp[i]))

    else:

        if (DEBUG_CALC):
            print("<br>ApparentTemp #6: Not cloudy or not likely POPs, no modifier: "
                  + str(db_ApparentTemp[i]))

    db_ApparentTemp[i] = int(round(float(db_ApparentTemp[i])))
    if (DEBUG_CALC):
        print("<br>ApparentTemp Final: Rounding to nearest whole number: "
              + str(db_ApparentTemp[i]))

    db_ShadeTemp[i] = int(round(float(db_ShadeTemp[i])))
    if (DEBUG_CALC):
        print("<br>ShadeTemp Final: Rounding to nearest whole number: "
              + str(db_ShadeTemp[i]))


def readWeatherRows(webpageRowNum, tabular, timezone):

    BSrowToGet = resetRowToGet(webpageRowNum)
    # For each column in the table, populate the DB. Note, 'i' is each datapoint representing an hour.
    for i in range(1, 25, 1):
        # print(timezone)
        db_Hour[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Hour ({})'.format(timezone), i, 1)
#        db_Hour[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Hour (EDT)', i, 1)
        if (db_Hour[i] == ""):
            print("<br>ERROR: Could not read hour row!")

        if (DEBUG_GET):
            print("<br>The hour is: " + db_Hour[i])

        db_date[i] = ifTextGetDataForDate(
            tabular, BSrowToGet, 'Date', i, 1)
#        db_Hour[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Hour (EDT)', i, 1)
        if (db_date[i] == ""):
            print("<br>ERROR: Could not read date row!")

        if (DEBUG_GET):
            print("<br>The date is: " + db_date[i])

        BSrowToGet = BSrowToGet + 1
        db_Temperature[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Temperature (°F)', i, 0)
        if (db_Temperature[i] == ""):
            print("<br>ERROR: Could not read temp row!")

        if (DEBUG_GET):
            print("<br>The temp is: " + db_Temperature[i])

        BSrowToGet = BSrowToGet + 1
        db_Dewpoint[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Dewpoint (°F)', i, 0)
        if (db_Dewpoint[i] == ""):
            print("<br>ERROR: Could not read dewpoint row!")

        if (DEBUG_GET):
            print("<br>The dewpoint is: " + db_Dewpoint[i])

        BSrowToGet = BSrowToGet + 1
        db_WindChill[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Wind Chill (°F)', i, 0)
        db_HeatIndex[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Heat Index (°F)', i, 0)
        if (db_WindChill[i] == "" and db_HeatIndex[i] == ""):
            print("<br>ERROR: Could not read WindChill/HeatIndex row!")

        if (DEBUG_GET):
            if (db_WindChill[i]):
                print("<br>The windchill is: " + db_WindChill[i])
            elif (db_HeatIndex[i]):
                print("<br>The heat index is: " + db_HeatIndex[i])

        BSrowToGet = BSrowToGet + 1
        db_SurfaceWind[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Surface Wind (mph)', i, 0)
        if (db_SurfaceWind[i] == ""):
            print("<br>ERROR: Could not read wind row!")

        if (DEBUG_GET):
            print("<br>The wind is: " + db_SurfaceWind[i])

        BSrowToGet = BSrowToGet + 1
        db_WindDir[i] = ifTextGetDataFor(tabular, BSrowToGet, 'Wind Dir', i, 0)
        if (db_WindDir[i] == ""):
            print("<br>ERROR: Could not read direction row!")

        if (DEBUG_GET):
            print("<br>The direction is: " + db_WindDir[i])

        # Note, if there are no gusts, this row on the webpage is left blank,
        # therefore a missing value is not an error.
        BSrowToGet = BSrowToGet + 1
        db_Gust[i] = ifTextGetDataFor(tabular, BSrowToGet, 'Gust', i, 0)

        if (DEBUG_GET):
            print("<br>The gust is: " + db_Gust[i])

        BSrowToGet = BSrowToGet + 1
        db_SkyCover[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Sky Cover (%)', i, 0)
        if (db_SkyCover[i] == ""):
            print("<br>ERROR: Could not read sky row!")

        if (DEBUG_GET):
            print("<br>The sky is: " + db_SkyCover[i])

        BSrowToGet = BSrowToGet + 1
        db_PrecipitationPotential[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Precipitation Potential (%)', i, 0)
        if (db_PrecipitationPotential[i] == ""):
            print("<br>ERROR: Could not read POP row!")

        if (DEBUG_GET):
            print("<br>The POP is: " + db_PrecipitationPotential[i])

        BSrowToGet = BSrowToGet + 1
        db_RelativeHumidity[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Relative Humidity (%)', i, 0)
        if (db_RelativeHumidity[i] == ""):
            print("<br>ERROR: Could not read humidity row!")

        if (DEBUG_GET):
            print("<br>The humidity is: " + db_RelativeHumidity[i])

        BSrowToGet = BSrowToGet + 1
        db_Rain[i] = ifTextGetDataFor(tabular, BSrowToGet, 'Rain', i, 0)
        if (db_Rain[i] == ""):
            print("<br>ERROR: Could not read rain row!")

        if (DEBUG_GET):
            print("<br>The rain is: " + db_Rain[i])

        BSrowToGet = BSrowToGet + 1
        db_Thunder[i] = ifTextGetDataFor(tabular, BSrowToGet, 'Thunder', i, 0)
        if (db_Thunder[i] == ""):
            print("<br>ERROR: Could not read thunder row!")

        if (DEBUG_GET):
            print("<br>The thunder is: " + db_Thunder[i])

        if (tabular.find_all('table')[7].find_all('tr')[BSrowToGet].find_all('td')[0].font):
            BSrowToGet = BSrowToGet + 1
            db_Snow[i] = ifTextGetDataFor(tabular, BSrowToGet, 'Snow', i, 0)
            if (db_Snow[i] == ""):
                print("<br>ERROR: Could not read Snow row!")

            if (DEBUG_GET):
                print("<br>The snow is: " + db_Snow[i])

        BSrowToGet = BSrowToGet + 1
        db_FreezingRain[i] = ifTextGetDataFor(
            tabular, BSrowToGet, 'Freezing Rain', i, 0)
        if (db_FreezingRain[i] == ""):
            print("<br>ERROR: Could not read freezing rain row!")

        if (DEBUG_GET):
            print("<br>The freezing rain is: " + db_FreezingRain[i])

        BSrowToGet = BSrowToGet + 1
        db_Sleet[i] = ifTextGetDataFor(tabular, BSrowToGet, 'Sleet', i, 0)
        if (db_Sleet[i] == ""):
            print("<br>ERROR: Could not read sleet row!")

        if (DEBUG_GET):
            print("<br>The sleet is: " + db_Sleet[i])

        BSrowToGet = resetRowToGet(webpageRowNum)

        if (db_HeatIndex[i] == ''):
            db_HeatIndex[i] = None

        if (db_WindChill[i] == ''):
            db_WindChill[i] = None

        if (db_Gust[i] == ''):
            db_Gust[i] = None

        calculateApparentTemp(i)
        calculateForecast(i)


def calculateForecast(i):
    if (db_Thunder[i] == 'Ocnl'):
        db_Forecast[i] = 'Thunder'

    elif (db_Sleet[i] == 'Ocnl'):
        db_Forecast[i] = 'Sleet'

    elif (db_Snow[i] == 'Ocnl'):
        db_Forecast[i] = 'Heavy Snow'

    elif (db_Rain[i] == 'Ocnl'):
        db_Forecast[i] = 'Heavy Rain'

    elif (db_FreezingRain[i] == 'Ocnl'):
        db_Forecast[i] = 'Freezing Rain'

    elif (db_Snow[i] == 'Lkly'):
        db_Forecast[i] = 'Moderate Snow'

    elif (db_Rain[i] == 'Lkly'):
        db_Forecast[i] = 'Moderate Rain'

    elif (db_Snow[i] == 'Chc'):
        db_Forecast[i] = 'Light Snow'

    elif (db_Rain[i] == 'Chc'):
        db_Forecast[i] = 'Light Rain'

    elif (int(db_SkyCover[i]) <= 30):
        db_Forecast[i] = 'Clear Sky'
    elif (int(db_SkyCover[i]) > 30 and int(db_SkyCover[i]) <= 60):
        db_Forecast[i] = 'Partly Cloudy'
    elif (int(db_SkyCover[i]) > 60 and int(db_SkyCover[i]) <= 80):
        db_Forecast[i] = 'Mostly Cloudy'
    elif (int(db_SkyCover[i]) > 80):
        db_Forecast[i] = 'Cloudy'


def getData(db_list):

    # result = ""

    # for data in db_list:
    #     if data is None:
    #         result += "--,"
    #     else:
    #         result += str(data)+","
    result = []
    for data in db_list:
        if data is None:
            result.append(None)
        else:
            result.append(str(data))
    return result


def getDataHr(db_datelist, db_list, tz):
    global lastValue
    dateresult = []
    hrresult = []

    result = []
    for data in db_datelist:
        current_year = datetime.now().year
        if data is None:
            # dateresult.append(None)
            dateresult.append(lastValue)
            # process_data_fn(lastValue)
        else:
            lastValue = f'{str(data)}/{current_year}'
            dateresult.append(lastValue)
        # print(dateresult)
    for data in db_list:
        if data is None:
            hrresult.append(None)
        else:
            val = data+":00:00"
            # result.append(str(val))
            hrresult.append(val)
    for i in range(len(hrresult)):

        # Append the current year to the input date-time string
        # input_date_time_str = f'{str(dateresult[i])+" "+str(hrresult[i])}/{current_year}'

        # Convert input date-time string to datetime object
        input_date_time = datetime.strptime(
            str(dateresult[i])+" "+str(hrresult[i]), '%m/%d/%Y %H:%M:%S')

        # Create a timezone object for the source timezone
        timezone_from = pytz.timezone(tz)

        # Localize the input date-time to the source timezone
        localized_time = timezone_from.localize(input_date_time)

        # Convert the localized time to UTC
        utc_time = localized_time.astimezone(pytz.utc)

        # Format the UTC time as string in yyyy-mm-dd hh:mm:ss format
        utc_time_str = utc_time.strftime('%Y-%m-%d %H:%M:%S')

        result.append(utc_time_str)
    # print(result)
    return result


def getAllData(row, tz):
    # city = row[3]

    locationid = row[4]

    postal_code = row[0]

    # timezoneFinal = tz

    # date = getData(db_date[1:])

    # hours = getDataHr(db_Hour[1:])
    # date = getData(db_date[1:])

    date = getDataHr(db_date[1:], db_Hour[1:], tz)

    temperatures = getData(db_Temperature[1:])

    dewpoints = getData(db_Dewpoint[1:])

    heatIndexs = getData(db_HeatIndex[1:])

    windChills = getData(db_WindChill[1:])

    surfaceWinds = getData(db_SurfaceWind[1:])

    windDirs = getData(db_WindDir[1:])

    gusts = getData(db_Gust[1:])

    skyCovers = getData(db_SkyCover[1:])

    precipitationPotentials = getData(db_PrecipitationPotential[1:])

    relativeHumiditys = getData(db_RelativeHumidity[1:])

    rains = getData(db_Rain[1:])

    thunders = getData(db_Thunder[1:])

    snows = getData(db_Snow[1:])

    freezingRains = getData(db_FreezingRain[1:])

    sleets = getData(db_Sleet[1:])

    forecast = getData(db_Forecast[1:])

    apparentTemps = getData(db_ApparentTemp[1:])

    insertData = pd.DataFrame({
        'location_id': locationid,
        'Date_Time': date,
        'Alert': '',
        'Forecast': forecast,
        'Temperature': temperatures,
        'DewPoint': dewpoints,
        'HeatIndex': heatIndexs,
        'WindChill': windChills,
        'SurfaceWind': surfaceWinds,
        'WindDir': windDirs,
        'Gust': gusts,
        'SkyCover': skyCovers,
        'PrecipitationPotential': precipitationPotentials,
        'RelativeHumidity': relativeHumiditys,
        'Rain': rains,
        'Thunder': thunders,
        'Snow': snows,
        'FreezingRain': freezingRains,
        'Sleet': sleets,
        'ApparentTemp': apparentTemps
    })

    return insertData
    # connection = pymysql.connect(
    #     host="localhost", user="root", passwd="Dm122448@", db="what_should_i_wear")

    # cursor = connection.cursor()
    # sqlCheck = "delete from weather where location_id = "+locationid+";"
    # try:
    #     # Execute the SQL command
    #     cursor.execute(sqlCheck)
    #     connection.commit()
    # except:
    #     print("Error: unable to fetch data")
    # # creating column list for insertion
    # cols = ",".join([str(i) for i in insertData.columns.tolist()])

    # # Insert DataFrame recrds one by one.
    # for i, row in insertData.iterrows():
    #     sql = "INSERT INTO weather (" + cols + \
    #         ") VALUES (" + "%s,"*(len(row)-1) + "%s)"
    #     cursor.execute(sql, tuple(row))
    #     # the connection is not autocommitted by default, so we must commit to save our changes
    #     connection.commit()

    # connection.close()


def getDataForLocations(weeklyOrhourly, allOrsingle):
    # print(weeklyOrhourly)
    # print(allOrsingle)
    recordCount = 0
    connection = pymysql.connect(
        host="localhost", user="root", passwd="Dm122448@", db="what_should_i_wear")
    if (str(allOrsingle) == 'all' and str(weeklyOrhourly) == 'weekly'):
        for row in df_locations:
            h = CaseInsensitiveDict()

            h["Accept"] = "application/json"

            resp = requests.get(url1.format(row[1], row[2]), headers=h)

            data = json.loads(resp.content.decode('utf-8'))

            timezone = data["features"][0]["properties"]["timezone"]["abbreviation_DST"]
            timezoneFormat = data["features"][0]["properties"]["timezone"]["name"]

            # for urlData in urlList:
            # get first 2 days data
            insertAllData = pd.DataFrame({})
            response = requests.get(url2days.format(row[1], row[2]))

            tabular = BeautifulSoup(response.content, 'html.parser')

            readWeatherRows(1, tabular, timezone)

            insertData1 = getAllData(row, timezoneFormat)

            readWeatherRows(2, tabular, timezone)

            insertData2 = getAllData(row, timezoneFormat)
            # get next 2 days data

            response2 = requests.get(url4days.format(row[1], row[2]))

            tabular2 = BeautifulSoup(response2.content, 'html.parser')

            readWeatherRows(1, tabular2, timezone)

            insertData3 = getAllData(row, timezoneFormat)

            readWeatherRows(2, tabular2, timezone)

            insertData4 = getAllData(row, timezoneFormat)

            # get remaining days data

            response3 = requests.get(url7days.format(row[1], row[2]))

            tabular3 = BeautifulSoup(response3.content, 'html.parser')

            readWeatherRows(1, tabular3, timezone)

            insertData5 = getAllData(row, timezoneFormat)

            readWeatherRows(2, tabular3, timezone)

            insertData6 = getAllData(row, timezoneFormat)

            insertAllData = pd.concat([insertData1, insertData2, insertData3,
                                       insertData4, insertData5, insertData6], ignore_index=True)
            recordCount = recordCount + len(insertAllData.index)

            # connection = pymysql.connect(
            #     host="localhost", user="root", passwd="Dm122448@", db="what_should_i_wear")

            cursor = connection.cursor()
            sqlCheck = "delete from weather where location_id = " + \
                str(row[4])+";"
            try:
                # Execute the SQL command
                cursor.execute(sqlCheck)
                connection.commit()
            except:
                print("Error: unable to fetch data")
            # creating column list for insertion
            cols = ",".join([str(i) for i in insertAllData.columns.tolist()])

            # Insert DataFrame recrds one by one.
            for i, row in insertAllData.iterrows():
                sql = "INSERT INTO weather (" + cols + \
                    ") VALUES (" + "%s,"*(len(row)-1) + "%s)"
                cursor.execute(sql, tuple(row))
                # the connection is not autocommitted by default, so we must commit to save our changes
                connection.commit()

            # connection.close()
    elif (str(allOrsingle) == 'all' and str(weeklyOrhourly) == 'hourly'):
        for row in df_locations:
            h = CaseInsensitiveDict()

            h["Accept"] = "application/json"

            resp = requests.get(url1.format(row[1], row[2]), headers=h)

            data = json.loads(resp.content.decode('utf-8'))

            timezone = data["features"][0]["properties"]["timezone"]["abbreviation_DST"]

            timezoneFormat = data["features"][0]["properties"]["timezone"]["name"]

            # for urlData in urlList:
            # get first 24 hrs data
            insertAllData = pd.DataFrame({})
            response = requests.get(url2days.format(row[1], row[2]))

            tabular = BeautifulSoup(response.content, 'html.parser')

            readWeatherRows(1, tabular, timezone)

            insertData1 = getAllData(row, timezoneFormat)
            recordCount = recordCount + len(insertData1.index)
            # insertAllData = pd.concat([insertData1], ignore_index=True)
            # print(insertAllData)
            # connection = pymysql.connect(
            #     host="localhost", user="root", passwd="Dm122448@", db="what_should_i_wear")

            cursor = connection.cursor()
            sqlCheck = "delete from weather where location_id = " + \
                str(row[4])+" and Date_Time <= "+"'" + \
                insertData1.Date_Time[23]+"'"+";"
            # print(sqlCheck)
            try:
                # Execute the SQL command
                cursor.execute(sqlCheck)
                connection.commit()
            except:
                print("Error: unable to fetch data")
            # creating column list for insertion
            cols = ",".join([str(i) for i in insertData1.columns.tolist()])
            # Insert DataFrame recrds one by one.
            for i, row in insertData1.iterrows():
                sql = "INSERT INTO weather (" + cols + \
                    ") VALUES (" + "%s,"*(len(row)-1) + "%s)"
                cursor.execute(sql, tuple(row))
                # the connection is not autocommitted by default, so we must commit to save our changes
                connection.commit()

            # connection.close()
    elif (str(allOrsingle) == 'single' and str(weeklyOrhourly) == 'hourly'):
        for row in df_locations:
            h = CaseInsensitiveDict()

            h["Accept"] = "application/json"

            resp = requests.get(url1.format(row[1], row[2]), headers=h)

            data = json.loads(resp.content.decode('utf-8'))

            timezone = data["features"][0]["properties"]["timezone"]["abbreviation_DST"]

            timezoneFormat = data["features"][0]["properties"]["timezone"]["name"]

            # for urlData in urlList:
            # get first 24 hrs data
            insertAllData = pd.DataFrame({})
            response = requests.get(url2days.format(row[1], row[2]))

            tabular = BeautifulSoup(response.content, 'html.parser')

            readWeatherRows(1, tabular, timezone)

            insertData1 = getAllData(row, timezoneFormat)

            insertAllData = pd.concat([insertData1], ignore_index=True)

            recordCount = recordCount + len(insertAllData.index)
            # connection = pymysql.connect(
            #     host="localhost", user="root", passwd="Dm122448@", db="what_should_i_wear")

            cursor = connection.cursor()

            cols = ",".join([str(i) for i in insertAllData.columns.tolist()])

            # Insert DataFrame recrds one by one.
            for i, row in insertAllData.iterrows():
                sql = "INSERT INTO weather (" + cols + \
                    ") VALUES (" + "%s,"*(len(row)-1) + "%s)"
                cursor.execute(sql, tuple(row))
                # the connection is not autocommitted by default, so we must commit to save our changes
                connection.commit()

            # connection.close()
    end_utc = datetime.utcnow()

    # convert UTC time to Eastern Standard Time
    end_eastern_tz = pytz.timezone('US/Eastern')
    end_est = end_eastern_tz.localize(end_utc)

    # format the current time in EST as mm-dd-yyyy hh:mm:ss
    end_est_formatted = end_est.strftime('%Y-%m-%d %H:%M:%S')

    time_diff = end_est - now_est

    total_seconds = int(time_diff.total_seconds())

    hours, remainder = divmod(total_seconds, 3600)

    minutes, seconds = divmod(remainder, 60)

    time_diff_str = "{:02d}:{:02d}:{:02d}".format(hours, minutes, seconds)

    cursor = connection.cursor()
    sqlLog = "insert into cronlogs (AllOrSingleJobType,HourlyOrWeeklyJobType,RecordsCount,CronStartTime,CronEndTime,TimeTaken) values (%s, %s, %s, %s,%s,%s);"
    insertLogData = (allOrsingle, weeklyOrhourly, recordCount,
                     now_est_formatted, end_est_formatted, time_diff_str)
    try:
        # Execute the SQL command
        cursor.execute(sqlLog, insertLogData)
        connection.commit()
    except pymysql.connect.Error as error:
        print("Failed to insert into MySQL table {}".format(error))
    connection.close()


estimateSunTimes()
getDataForLocations(weeklyOrHourly, allOrSingle)
