from requests import request, ConnectionError
from weatherman exceptions import ApiCallFailed
from weatherman import utils

class BaseWeather(object):
    """A base weather provider"""
    name = ''  # provider name
    URL = '' # provider URL
    SETTING_KEY= '' # get the key from django settings here

    def get_weather_data(self, city, *args, **kwargs):
        secret_key = utils.get_setting(self.SETTING_KEY)
        params = {'q': city, 'appid': secret_key}

        if (self.EXTRA_PARAMS):
            params.update(self.EXTRA_PARAMS)
        

        return self.get_json(self.URL, params=params, **kwargs)
        
    def request(self, url, params, method='GET', **kwargs):
        try:
            response = request(method, url, params=params)
        except ConnectionError as err:
            raise ApiCallFailed(self, str(err))
        response.raise_for_status()
        return response

    def get_json(self, url, params, **kwargs):
        return self.request(url, params, **kwargs).json()
        