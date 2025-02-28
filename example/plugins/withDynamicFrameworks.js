const { withDangerousMod } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

const withDynamicFrameworks = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      // Find the Podfile
      const podfile = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      // Read the Podfile
      const podfileContents = fs.readFileSync(podfile, 'utf8')
      // Merge the contents of the Podfile with the new content setting
      // the deployment target of all targets to 16.0
      const setDeploymentTarget = mergeContents({
        tag: 'reanimated-static-library',
        src: podfileContents,
        newSrc: `  pre_install do |installer|
    installer.pod_targets.each do |pod|
      if pod.name.eql?('RNReanimated') || pod.name.eql?('react-native-keyboard-controller')
        def pod.build_type
          Pod::BuildType.static_library
        end
      end
    end
  end`,
        anchor: /post_install do \|installer\|/i,
        offset: -1,
        comment: '#'
      })

      if (!setDeploymentTarget.didMerge) {
        console.log('Failed to set iOS deployment target')
        return config
      }

      fs.writeFileSync(podfile, setDeploymentTarget.contents)

      return config
    }
  ])
}

module.exports = withDynamicFrameworks;
