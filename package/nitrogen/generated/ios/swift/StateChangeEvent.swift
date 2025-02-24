///
/// StateChangeEvent.swift
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

import NitroModules

/**
 * Represents an instance of `StateChangeEvent`, backed by a C++ struct.
 */
public typealias StateChangeEvent = margelo.nitro.rnmlx.StateChangeEvent

public extension StateChangeEvent {
  private typealias bridge = margelo.nitro.rnmlx.bridge.swift

  /**
   * Create a new instance of `StateChangeEvent`.
   */
  init(type: RNMLXEventTypes, state: ModelState) {
    self.init(type, state)
  }

  var type: RNMLXEventTypes {
    @inline(__always)
    get {
      return self.__type
    }
    @inline(__always)
    set {
      self.__type = newValue
    }
  }
  
  var state: ModelState {
    @inline(__always)
    get {
      return self.__state
    }
    @inline(__always)
    set {
      self.__state = newValue
    }
  }
}
